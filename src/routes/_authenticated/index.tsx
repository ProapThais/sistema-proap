import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoNotice, PageHeader, Stat, Badge, statusTone, pageHead, btnClass } from "@/components/ui-kit";
import { repo, dataBR } from "@/data/repository";
import { Home, Users, ClipboardList, GraduationCap, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => pageHead("Painel inicial", "Visão geral ilustrativa do acompanhamento social e educacional."),
  component: Painel,
});

function Painel() {
  const familias = repo.familias();
  const demandas = repo.demandas();
  const abertas = demandas.filter((d) => d.status !== "Concluída");
  return (
    <>
      <PageHeader title="Painel inicial" description="Visão geral do acompanhamento social e educacional."
        actions={<Link to="/familias/nova" className={btnClass()}><Plus className="h-4 w-4" aria-hidden />Cadastrar família</Link>} />
      <DemoNotice />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Famílias (demo)" icon={Home} tone="info" value={familias.length} note={`${familias.filter((f) => f.status !== "Inativa").length} ativas`} />
        <Stat label="Integrantes (demo)" icon={Users} tone="success" value={repo.pessoas().length} />
        <Stat label="Demandas em aberto (demo)" icon={ClipboardList} tone="accent" value={abertas.length} />
        <Stat label="Matrículas ativas (demo)" icon={GraduationCap} tone="primary" value={repo.matriculas().filter((m) => m.status === "Ativa").length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Demandas recentes</h2>
          <ul className="divide-y">
            {abertas.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div><p className="font-medium">{d.titulo}</p><p className="text-xs text-muted-foreground">{d.categoria} · {dataBR(d.data)}</p></div>
                <Badge tone={statusTone[d.status]}>{d.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-3 text-lg font-semibold">Últimos atendimentos</h2>
          <ul className="divide-y">
            {repo.atendimentos().slice(0, 5).map((a) => (
              <li key={a.id} className="py-2.5 text-sm">
                <Link to="/familias/$id" params={{ id: a.familiaId }} className="font-medium hover:underline">{repo.familia(a.familiaId)?.responsavel}</Link>
                <p className="text-xs text-muted-foreground">{a.tipo} · {dataBR(a.data)} · {a.profissional}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
