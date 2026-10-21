import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Table, td, Badge, statusTone, Select, SearchInput, Empty, pageHead, DemoNotice, Card } from "@/components/ui-kit";
import { repo, dataBR, normalizar } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/demandas")({
  head: () => pageHead("Demandas sociais", "Demandas sociais por categoria e status (demonstração)."),
  component: Demandas,
});

const cats = ["Alimentação", "Moradia", "Saúde", "Educação", "Documentação", "Trabalho e renda"];
const sts = ["Aberta", "Em andamento", "Encaminhada", "Concluída"];

function Demandas() {
  const [q, setQ] = useState(""); const [cat, setCat] = useState(""); const [st, setSt] = useState("");
  const todas = repo.demandas();
  const lista = todas.filter((d) => (!q || normalizar(d.titulo).includes(normalizar(q))) && (!cat || d.categoria === cat) && (!st || d.status === st));
  return (
    <>
      <PageHeader title="Demandas sociais" description="Acompanhe as demandas por categoria e status." />
      <DemoNotice />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {sts.map((s) => (
          <button key={s} onClick={() => setSt(st === s ? "" : s)} aria-pressed={st === s} className="text-left">
            <Card className={st === s ? "ring-2 ring-ring" : ""}><Badge tone={statusTone[s]}>{s}</Badge><p className="mt-2 font-display text-2xl">{todas.filter((d) => d.status === s).length}</p></Card>
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={q} onChange={setQ} label="Buscar demanda" />
        <Select aria-label="Filtrar por categoria" value={cat} onChange={(e) => setCat(e.target.value)} className="w-auto"><option value="">Todas as categorias</option>{cats.map((c) => <option key={c}>{c}</option>)}</Select>
        <Select aria-label="Filtrar por status" value={st} onChange={(e) => setSt(e.target.value)} className="w-auto"><option value="">Todos os status</option>{sts.map((c) => <option key={c}>{c}</option>)}</Select>
      </div>
      {lista.length === 0 ? <Empty>Nenhuma demanda encontrada.</Empty> : (
        <Table head={["Demanda", "Categoria", "Família", "Data", "Status"]}>
          {lista.map((d) => (
            <tr key={d.id}><td className={td + " font-medium"}>{d.titulo}</td><td className={td}>{d.categoria}</td>
              <td className={td}><Link to="/familias/$id" params={{ id: d.familiaId }} className="text-primary hover:underline">{repo.familia(d.familiaId)?.codigo}</Link></td>
              <td className={td}>{dataBR(d.data)}</td><td className={td}><Badge tone={statusTone[d.status]}>{d.status}</Badge></td></tr>
          ))}
        </Table>
      )}
    </>
  );
}
