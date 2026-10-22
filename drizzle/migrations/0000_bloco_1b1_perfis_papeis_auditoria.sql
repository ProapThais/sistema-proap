CREATE TYPE public.app_role AS ENUM ('administrador','servico_social','psicologo','coordenacao','diretoria','recepcao','professor','voluntario');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_exibicao text NOT NULL DEFAULT '',
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now(),
  criado_por uuid,
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.auditoria (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ator_id uuid,
  acao text NOT NULL,
  entidade text NOT NULL,
  entidade_id text,
  detalhes jsonb NOT NULL DEFAULT '{}'::jsonb,
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auditoria TO authenticated;
GRANT ALL ON public.auditoria TO service_role;
ALTER TABLE public.auditoria ENABLE ROW LEVEL SECURITY;

-- Papel válido somente para usuário ativo
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    JOIN public.profiles p ON p.id = r.user_id AND p.ativo
    WHERE r.user_id = _user_id AND r.role = _role
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Políticas (negação por padrão: só o que está abaixo é permitido)
CREATE POLICY "perfil_ler_proprio_ou_admin" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'administrador'));
CREATE POLICY "perfil_admin_atualiza_outros" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'administrador') AND id <> auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'administrador') AND id <> auth.uid());

CREATE POLICY "papel_ler_proprio_ou_admin" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'administrador'));
CREATE POLICY "papel_admin_atribui_outros" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'administrador') AND user_id <> auth.uid());
CREATE POLICY "papel_admin_remove_outros" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'administrador') AND user_id <> auth.uid());

CREATE POLICY "auditoria_admin_le" ON public.auditoria FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'administrador'));

-- Proteções de colunas e carimbos
CREATE OR REPLACE FUNCTION public.profiles_antes_atualizar()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.id := OLD.id;
  NEW.criado_em := OLD.criado_em;
  NEW.atualizado_em := now();
  RETURN NEW;
END $$;
CREATE TRIGGER trg_profiles_antes_atualizar BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_antes_atualizar();

CREATE OR REPLACE FUNCTION public.user_roles_antes_inserir()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.criado_por := auth.uid();
  NEW.criado_em := now();
  RETURN NEW;
END $$;
CREATE TRIGGER trg_user_roles_antes_inserir BEFORE INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.user_roles_antes_inserir();

-- Auditoria (sem conteúdo confidencial: só ids, papel e situação)
CREATE OR REPLACE FUNCTION public.auditar_user_roles()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.auditoria(ator_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'papel_atribuido', 'user_roles', NEW.user_id::text, jsonb_build_object('papel', NEW.role));
    RETURN NEW;
  ELSE
    INSERT INTO public.auditoria(ator_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'papel_removido', 'user_roles', OLD.user_id::text, jsonb_build_object('papel', OLD.role));
    RETURN OLD;
  END IF;
END $$;
CREATE TRIGGER trg_auditar_user_roles AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.auditar_user_roles();

CREATE OR REPLACE FUNCTION public.auditar_profiles()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.ativo IS DISTINCT FROM OLD.ativo THEN
    INSERT INTO public.auditoria(ator_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), CASE WHEN NEW.ativo THEN 'usuario_reativado' ELSE 'usuario_desativado' END, 'profiles', NEW.id::text, '{}'::jsonb);
  END IF;
  IF NEW.nome_exibicao IS DISTINCT FROM OLD.nome_exibicao THEN
    INSERT INTO public.auditoria(ator_id, acao, entidade, entidade_id, detalhes)
    VALUES (auth.uid(), 'nome_alterado', 'profiles', NEW.id::text, '{}'::jsonb);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_auditar_profiles AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.auditar_profiles();

-- Perfil automático para cada conta criada (sem papel algum)
CREATE OR REPLACE FUNCTION public.criar_perfil_novo_usuario()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles(id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created_proap AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.criar_perfil_novo_usuario();

REVOKE EXECUTE ON FUNCTION public.profiles_antes_atualizar(), public.user_roles_antes_inserir(), public.auditar_user_roles(), public.auditar_profiles(), public.criar_perfil_novo_usuario() FROM PUBLIC, anon, authenticated;