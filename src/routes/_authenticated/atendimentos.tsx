import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, Select, Empty, pageHead, DemoNotice, Badge } from "@/components/ui-kit";
import { repo, dataBR } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/atendimentos")({
  head: () => pageHead("Histórico de atendimentos", "Atendimentos em ordem cronológica (dados fictícios)."),
  component: Atendimentos,
});

function Atendimentos() {
  const [tipo, setTipo] = useState("");
  const lista = repo.atendimentos().filter((a) => !tipo || a.tipo === tipo);
  return (
    <>
      <PageHeader title="Histórico de atendimentos" description="Do mais recente para o mais antigo." />
      <DemoNotice>atendimentos e textos ilustrativos.</DemoNotice>
      <Select aria-label="Filtrar por tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="mb-5 w-auto">
        <option value="">Todos os tipos</option>{["Acolhimento", "Visita", "Retorno", "Orientação"].map((t) => <option key={t}>{t}</option>)}
      </Select>
      {lista.length === 0 ? <Empty>Nenhum atendimento.</Empty> : (
        <ol className="relative space-y-4 border-l-2 border-primary/30 pl-6">
          {lista.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[31px] top-5 h-3 w-3 rounded-full bg-accent ring-4 ring-background" aria-hidden />
              <Card>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><time dateTime={a.data} className="font-semibold text-foreground">{dataBR(a.data)}</time> · {a.profissional} <Badge tone="primary">{a.tipo}</Badge></div>
                <Link to="/familias/$id" params={{ id: a.familiaId }} className="mt-1 block font-semibold hover:underline">{repo.familia(a.familiaId)?.responsavel}</Link>
                <p className="text-sm">{a.resumo}</p>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
