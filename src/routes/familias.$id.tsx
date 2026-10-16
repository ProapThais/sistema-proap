import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, Badge, statusTone, Table, td, Empty, pageHead, btnClass } from "@/components/ui-kit";
import { repo, dataBR, idade } from "@/data/repository";
import * as demo from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/familias/$id")({
  loader: ({ params }) => {
    const familia = repo.familia(params.id);
    if (!familia) throw notFound();
    return { familia };
  },
  head: () => pageHead("Ficha familiar", "Ficha com dados, integrantes, demandas, atendimentos e encaminhamentos."),
  component: Ficha,
});

const abas = ["Dados", "Integrantes", "Demandas", "Atendimentos", "Encaminhamentos"] as const;

function Ficha() {
  const { familia: f } = Route.useLoaderData();
  const [aba, setAba] = useState<(typeof abas)[number]>("Dados");
  const integrantes = repo.pessoasDaFamilia(f.id);
  const dem = demo.demandas.filter((d) => d.familiaId === f.id);
  const ate = repo.atendimentos().filter((a) => a.familiaId === f.id);
  const enc = demo.encaminhamentos.filter((e) => e.familiaId === f.id);
  return (
    <>
      <PageHeader title={f.responsavel} description={`Ficha familiar · ${f.codigo} · dados fictícios`}
        actions={<><Link to="/familias" className={btnClass("outline")}>Voltar</Link><Link to="/familias/$id/editar" params={{ id: f.id }} className={btnClass()}>Editar</Link></>} />
      <div role="tablist" aria-label="Seções da ficha" className="mb-4 flex gap-1 overflow-x-auto border-b">
        {abas.map((a) => (
          <button key={a} role="tab" id={`tab-${a}`} aria-selected={aba === a} aria-controls="painel-aba" onClick={() => setAba(a)}
            className={cn("whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium", aba === a ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {a}
          </button>
        ))}
      </div>
      <div role="tabpanel" id="painel-aba" aria-labelledby={`tab-${aba}`}>
        {aba === "Dados" && (
          <Card>
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[["Código", f.codigo], ["Responsável", f.responsavel], ["Bairro", f.bairro], ["Telefone", f.telefone], ["Data de cadastro", dataBR(f.dataCadastro)], ["Observações", f.observacoes || "—"]].map(([k, v]) => (
                <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
              <div><dt className="text-muted-foreground">Situação</dt><dd><Badge tone={statusTone[f.status]}>{f.status}</Badge></dd></div>
            </dl>
          </Card>
        )}
        {aba === "Integrantes" && (integrantes.length ? (
          <Table head={["Nome", "Parentesco", "Idade"]}>
            {integrantes.map((p) => <tr key={p.id}><td className={td + " font-medium"}>{p.nome}</td><td className={td}>{p.parentesco}</td><td className={td}>{idade(p.anoNascimento)} anos</td></tr>)}
          </Table>) : <Empty>Nenhum integrante vinculado.</Empty>)}
        {aba === "Demandas" && (dem.length ? (
          <Table head={["Demanda", "Categoria", "Data", "Status"]}>
            {dem.map((d) => <tr key={d.id}><td className={td}>{d.titulo}</td><td className={td}>{d.categoria}</td><td className={td}>{dataBR(d.data)}</td><td className={td}><Badge tone={statusTone[d.status]}>{d.status}</Badge></td></tr>)}
          </Table>) : <Empty>Nenhuma demanda registrada.</Empty>)}
        {aba === "Atendimentos" && (ate.length ? (
          <ol className="space-y-3 border-l-2 border-primary/30 pl-5">
            {ate.map((a) => <li key={a.id}><Card><p className="text-xs text-muted-foreground">{dataBR(a.data)} · {a.profissional}</p><p className="font-semibold">{a.tipo}</p><p className="text-sm">{a.resumo}</p></Card></li>)}
          </ol>) : <Empty>Nenhum atendimento registrado.</Empty>)}
        {aba === "Encaminhamentos" && (enc.length ? (
          <Table head={["Data", "Destino", "Motivo", "Status"]}>
            {enc.map((e) => <tr key={e.id}><td className={td}>{dataBR(e.data)}</td><td className={td}>{e.destino}</td><td className={td}>{e.motivo}</td><td className={td}><Badge tone={statusTone[e.status]}>{e.status}</Badge></td></tr>)}
          </Table>) : <Empty>Nenhum encaminhamento registrado.</Empty>)}
      </div>
    </>
  );
}
