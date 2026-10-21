import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Table, td, Badge, statusTone, Select, SearchInput, Empty, pageHead, DemoNotice } from "@/components/ui-kit";
import { repo, dataBR, normalizar } from "@/data/repository";

export const Route = createFileRoute("/matriculas")({
  head: () => pageHead("Matrículas", "Matrículas com status, data de ingresso e responsável legal."),
  component: Matriculas,
});

function Matriculas() {
  const [q, setQ] = useState(""); const [st, setSt] = useState(""); const [turma, setTurma] = useState("");
  const lista = repo.matriculas().filter((m) => {
    const p = repo.pessoa(m.pessoaId);
    return (!q || normalizar(p?.nome ?? "").includes(normalizar(q))) && (!st || m.status === st) && (!turma || m.turmaId === turma);
  });
  return (
    <>
      <PageHeader title="Matrículas" description="Uma pessoa pode estar em mais de uma turma." />
      <DemoNotice>matrículas fictícias.</DemoNotice>
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={q} onChange={setQ} label="Buscar aluno(a)" />
        <Select aria-label="Filtrar por turma" value={turma} onChange={(e) => setTurma(e.target.value)} className="w-auto"><option value="">Todas as turmas</option>{repo.turmas().map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</Select>
        <Select aria-label="Filtrar por status" value={st} onChange={(e) => setSt(e.target.value)} className="w-auto"><option value="">Todos os status</option>{["Ativa", "Trancada", "Concluída", "Lista de espera"].map((s) => <option key={s}>{s}</option>)}</Select>
      </div>
      {lista.length === 0 ? <Empty>Nenhuma matrícula encontrada.</Empty> : (
        <Table head={["Aluno(a)", "Turma", "Ingresso", "Responsável legal", "Status"]}>
          {lista.map((m) => (
            <tr key={m.id}><td className={td + " font-medium"}>{repo.pessoa(m.pessoaId)?.nome}</td><td className={td}>{repo.turma(m.turmaId)?.nome}</td>
              <td className={td}>{dataBR(m.dataIngresso)}</td><td className={td}>{m.responsavelLegal}</td><td className={td}><Badge tone={statusTone[m.status]}>{m.status}</Badge></td></tr>
          ))}
        </Table>
      )}
    </>
  );
}
