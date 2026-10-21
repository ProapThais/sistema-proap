import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Home, Users, ClipboardList, History, BookOpen, CalendarDays, GraduationCap,
  CheckSquare, BarChart3, ShieldCheck, Menu, X, HeartHandshake, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Endereços públicos que não exibem o menu interno.
const ROTAS_PUBLICAS = ["/entrar", "/recuperar-senha"];

const grupos = [
  { titulo: "Geral", itens: [{ to: "/", label: "Painel inicial", icon: LayoutDashboard }] },
  { titulo: "Social", itens: [
    { to: "/familias", label: "Famílias", icon: Home },
    { to: "/pessoas", label: "Pessoas e integrantes", icon: Users },
    { to: "/demandas", label: "Demandas sociais", icon: ClipboardList },
    { to: "/atendimentos", label: "Atendimentos", icon: History },
  ]},
  { titulo: "Educacional", itens: [
    { to: "/aulas", label: "Aulas e modalidades", icon: BookOpen },
    { to: "/turmas", label: "Turmas", icon: CalendarDays },
    { to: "/matriculas", label: "Matrículas", icon: GraduationCap },
    { to: "/frequencia", label: "Frequência", icon: CheckSquare },
  ]},
  { titulo: "Gestão", itens: [
    { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
    { to: "/administracao", label: "Usuários e perfis", icon: ShieldCheck },
  ]},
] as const;

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const ativo = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));
  return (
    <nav aria-label="Navegação principal" className="space-y-5">
      {grupos.map((g) => (
        <div key={g.titulo}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">{g.titulo}</p>
          <ul className="space-y-0.5">
            {g.itens.map((i) => (
              <li key={i.to}>
                <Link
                  to={i.to}
                  onClick={onNavigate}
                  aria-current={ativo(i.to) ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent",
                    ativo(i.to) && "bg-sidebar-accent font-semibold",
                  )}
                >
                  <i.icon className="h-4 w-4 shrink-0" aria-hidden />
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Marca() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground"><HeartHandshake className="h-5 w-5" aria-hidden /></span>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold">Sistema PROAP</p>
        <p className="text-[11px] text-sidebar-muted">Cadastro e Acompanhamento Social</p>
      </div>
    </div>
  );
}

function Sessao({ userEmail, onSignOut, onNavigate }: { userEmail: string | null; onSignOut: () => void; onNavigate?: () => void }) {
  return (
    <div className="space-y-2">
      {userEmail && (
        <p className="truncate rounded-lg bg-sidebar-accent px-3 py-2 text-xs text-sidebar-muted" title={userEmail}>
          Conectado como <span className="font-medium text-sidebar-foreground">{userEmail}</span>
        </p>
      )}
      <button
        type="button"
        onClick={() => { onNavigate?.(); onSignOut(); }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent"
      >
        <LogOut className="h-4 w-4 shrink-0" aria-hidden />
        Sair
      </button>
    </div>
  );
}

export function AppShell({ children, userEmail, onSignOut }: { children: ReactNode; userEmail: string | null; onSignOut: () => void }) {
  const [aberto, setAberto] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  // Telas públicas (entrada e recuperação) não exibem o menu interno.
  if (ROTAS_PUBLICAS.some((r) => path.startsWith(r))) {
    return <main id="conteudo" className="min-h-screen px-4 py-6 sm:px-6">{children}</main>;
  }

  return (
    <div className="min-h-screen lg:flex">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-card focus:p-2">Pular para o conteúdo</a>
      <aside className="hidden w-64 shrink-0 flex-col gap-6 bg-sidebar p-4 text-sidebar-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
        <Marca />
        <Nav />
        <div className="mt-auto space-y-3">
          <Sessao userEmail={userEmail} onSignOut={onSignOut} />
          <p className="rounded-lg bg-sidebar-accent p-3 text-xs text-sidebar-muted">Versão de demonstração. Todos os dados são fictícios.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground lg:hidden">
        <Marca />
        <button aria-label={aberto ? "Fechar menu" : "Abrir menu"} aria-expanded={aberto} onClick={() => setAberto(!aberto)} className="rounded-lg p-2 hover:bg-sidebar-accent">
          {aberto ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>
      {aberto && (
        <div className="fixed inset-0 top-[60px] z-20 overflow-y-auto bg-sidebar p-4 text-sidebar-foreground lg:hidden">
          <Nav onNavigate={() => setAberto(false)} />
          <div className="mt-5 border-t border-sidebar-accent pt-4">
            <Sessao userEmail={userEmail} onSignOut={onSignOut} onNavigate={() => setAberto(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="border-b border-warning/50 bg-warning/20 px-4 py-1.5 text-center text-xs font-medium text-warning-foreground">
          Ambiente de demonstração — todos os dados são fictícios.
        </div>
        <main id="conteudo" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
