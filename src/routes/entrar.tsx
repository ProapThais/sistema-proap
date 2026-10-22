import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { HeartHandshake } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, Card, Field, Input, pageHead } from "@/components/ui-kit";

// Destino pós-login: só caminhos internos (começam com "/" e não "//"),
// nunca endereços externos.
function destinoSeguro(valor: unknown): string {
  if (typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//")) return valor;
  return "/";
}

export const Route = createFileRoute("/entrar")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    const destino = destinoSeguro(search["redirect"]);
    return destino === "/" ? {} : { redirect: destino };
  },
  head: () => pageHead("Entrar", "Acesso ao Sistema PROAP com e-mail e senha."),
  component: EntrarPage,
});

function EntrarPage() {
  const { redirect: destino } = Route.useSearch();
  const router = useRouter();
  const [modo, setModo] = useState<"entrar" | "recuperar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEntrar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) {
      setErro("E-mail ou senha incorretos. Verifique e tente novamente.");
      return;
    }
    router.history.push(destinoSeguro(destino));
  }

  async function aoRecuperar(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/recuperar-senha`,
    });
    setEnviando(false);
    // Mensagem neutra: não revela se o e-mail está cadastrado.
    setAviso("Se este e-mail estiver cadastrado, você receberá um link para definir uma nova senha. Verifique também a caixa de spam.");
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
            <HeartHandshake className="h-5 w-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold">Sistema PROAP</p>
            <p className="text-xs text-muted-foreground">Cadastro e Acompanhamento Social</p>
          </div>
        </div>

        {modo === "entrar" ? (
          <form onSubmit={aoEntrar} className="space-y-4" noValidate={false}>
            <h1 className="text-xl font-bold">Entrar</h1>
            <Field label="E-mail" id="email" required>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Senha" id="senha" required>
              <Input id="senha" type="password" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)} />
            </Field>
            {erro && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{erro}</p>}
            <Btn type="submit" disabled={enviando} className="w-full">
              {enviando ? "Entrando…" : "Entrar"}
            </Btn>
            <button type="button" onClick={() => { setModo("recuperar"); setErro(null); setAviso(null); }} className="w-full text-center text-sm font-medium text-primary hover:underline">
              Esqueci minha senha
            </button>
            <p className="text-center text-xs text-muted-foreground">
              O acesso é individual e criado pela administração. Não há cadastro público.
            </p>
          </form>
        ) : (
          <form onSubmit={aoRecuperar} className="space-y-4">
            <h1 className="text-xl font-bold">Recuperar senha</h1>
            <p className="text-sm text-muted-foreground">Informe seu e-mail para receber o link de redefinição.</p>
            <Field label="E-mail" id="email-rec" required>
              <Input id="email-rec" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            {aviso && <p role="status" className="rounded-md bg-info/10 px-3 py-2 text-sm text-info">{aviso}</p>}
            {erro && <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{erro}</p>}
            <Btn type="submit" disabled={enviando} className="w-full">
              {enviando ? "Enviando…" : "Enviar link de recuperação"}
            </Btn>
            <button type="button" onClick={() => { setModo("entrar"); setErro(null); setAviso(null); }} className="w-full text-center text-sm font-medium text-primary hover:underline">
              Voltar para entrar
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
