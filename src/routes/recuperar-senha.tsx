import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Field, Input, pageHead } from "@/components/ui-kit";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => pageHead("Definir nova senha", "Defina uma nova senha de acesso ao Sistema PROAP."),
  component: RecuperarSenhaPage,
});

function RecuperarSenhaPage() {
  const [pronto, setPronto] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // O link de recuperação chega com type=recovery no endereço; o cliente de
    // autenticação processa esse link e emite o evento PASSWORD_RECOVERY.
    if (window.location.hash.includes("type=recovery")) setPronto(true);
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setPronto(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function aoSalvar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmacao) {
      setErro("As senhas não coincidem. Digite novamente.");
      return;
    }
    setEnviando(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setEnviando(false);
    if (error) {
      setErro("Não foi possível definir a nova senha. O link pode ter expirado — solicite outro.");
      return;
    }
    setConcluido(true);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        {concluido ? (
          <div className="space-y-4 text-center">
            <h1 className="text-xl font-bold">Senha atualizada</h1>
            <p className="text-sm text-muted-foreground">Sua nova senha foi definida com sucesso.</p>
            <Link to="/entrar" className="inline-block text-sm font-medium text-primary hover:underline">
              Ir para a tela de entrada
            </Link>
          </div>
        ) : pronto ? (
          <form onSubmit={aoSalvar} className="space-y-4">
            <h1 className="text-xl font-bold">Definir nova senha</h1>
            <Field label="Nova senha" id="nova-senha" required hint="Mínimo de 6 caracteres.">
              <Input id="nova-senha" type="password" autoComplete="new-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Field>
            <Field label="Confirmar nova senha" id="conf-senha" required>
              <Input id="conf-senha" type="password" autoComplete="new-password" required value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} />
            </Field>
            {erro && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{erro}</p>}
            <Btn type="submit" disabled={enviando} className="w-full">
              {enviando ? "Salvando…" : "Salvar nova senha"}
            </Btn>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <h1 className="text-xl font-bold">Link inválido ou expirado</h1>
            <p className="text-sm text-muted-foreground">
              Este link de recuperação não é mais válido. Solicite um novo na tela de entrada.
            </p>
            <Link to="/entrar" className="inline-block text-sm font-medium text-primary hover:underline">
              Ir para a tela de entrada
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}
