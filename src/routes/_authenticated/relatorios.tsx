import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, DemoNotice, pageHead } from "@/components/ui-kit";
import { repo } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/relatorios")({
  head: () => pageHead("Relatórios", "Relatórios sociais e educacionais de demonstração."),
  component: Relatorios,
});

function Barras({ titulo, dados }: { titulo: string; dados: [string, number][] }) {
  const max = Math.max(1, ...dados.map((d) => d[1]));
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">{titulo}</h2>
      <ul className="space-y-3">
        {dados.map(([k, v]) => (
          <li key={k} className="text-sm">
            <div className="mb-1 flex justify-between"><span>{k}</span><span className="font-semibold">{v}</span></div>
            <div className="h-2.5 rounded-full bg-muted" role="presentation"><div className="h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function contar<T>(arr: T[], key: (t: T) => string): [string, number][] {
  const m = new Map<string, number>();
  arr.forEach((a) => m.set(key(a), (m.get(key(a)) ?? 0) + 1));
  return [...m.entries()];
}

function Relatorios() {
  return (
    <>
      <PageHeader title="Relatórios sociais e educacionais" description="Gráficos simples calculados sobre os dados de demonstração." />
      <DemoNotice />
      <div className="grid gap-6 lg:grid-cols-2">
        <Barras titulo="Demandas por categoria" dados={contar(repo.demandas(), (d) => d.categoria)} />
        <Barras titulo="Demandas por status" dados={contar(repo.demandas(), (d) => d.status)} />
        <Barras titulo="Famílias por bairro" dados={contar(repo.familias(), (f) => f.bairro)} />
        <Barras titulo="Matrículas ativas por turma" dados={repo.turmas().map((t) => [t.nome, repo.matriculas().filter((m) => m.turmaId === t.id && m.status === "Ativa").length])} />
      </div>
    </>
  );
}
