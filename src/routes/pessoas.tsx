import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Table, td, SearchInput, Select, Empty, pageHead, DemoNotice } from "@/components/ui-kit";
import { repo, normalizar, idade } from "@/data/repository";

export const Route = createFileRoute("/pessoas")({
  head: () => pageHead("Pessoas e integrantes", "Pessoas vinculadas às famílias (dados fictícios)."),
  component: Pessoas,
});

function Pessoas() {
  const [q, setQ] = useState("");
  const [par, setPar] = useState("");
  const lista = repo.pessoas().filter((p) => (!q || normalizar(p.nome).includes(normalizar(q))) && (!par || p.parentesco === par));
  return (
    <>
      <PageHeader title="Pessoas e integrantes" description="Cada pessoa está vinculada a uma família." />
      <DemoNotice>nomes fictícios, sem documentos ou dados sensíveis.</DemoNotice>
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={q} onChange={setQ} label="Buscar pessoa pelo nome" />
        <Select aria-label="Filtrar por parentesco" value={par} onChange={(e) => setPar(e.target.value)} className="w-auto">
          <option value="">Todos os vínculos</option>{["Responsável", "Cônjuge", "Filho(a)", "Neto(a)", "Avô/Avó", "Outro"].map((p) => <option key={p}>{p}</option>)}
        </Select>
      </div>
      {lista.length === 0 ? <Empty>Nenhuma pessoa encontrada.</Empty> : (
        <Table head={["Nome", "Vínculo", "Idade", "Família"]}>
          {lista.map((p) => { const f = repo.familia(p.familiaId); return (
            <tr key={p.id}><td className={td + " font-medium"}>{p.nome}</td><td className={td}>{p.parentesco}</td><td className={td}>{idade(p.anoNascimento)} anos</td>
              <td className={td}><Link to="/familias/$id" params={{ id: p.familiaId }} className="text-primary hover:underline">{f?.codigo} · {f?.responsavel}</Link></td></tr>); })}
        </Table>
      )}
    </>
  );
}
