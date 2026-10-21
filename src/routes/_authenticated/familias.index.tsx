import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Table, td, Badge, statusTone, SearchInput, Select, Empty, pageHead, btnClass, DemoNotice } from "@/components/ui-kit";
import { repo, normalizar, dataBR } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/familias/")({
  head: () => pageHead("Famílias", "Busca, filtros e listagem das famílias cadastradas (demonstração)."),
  component: Familias,
});

function Familias() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [bairro, setBairro] = useState("");
  const todas = repo.familias();
  const bairros = [...new Set(todas.map((f) => f.bairro))];
  const lista = useMemo(() => todas.filter((f) =>
    (!q || normalizar(`${f.responsavel} ${f.codigo}`).includes(normalizar(q))) &&
    (!status || f.status === status) && (!bairro || f.bairro === bairro)), [q, status, bairro, todas]);
  return (
    <>
      <PageHeader title="Famílias" description="Pesquise por nome do responsável ou código."
        actions={<Link to="/familias/nova" className={btnClass()}>Nova família</Link>} />
      <DemoNotice>todos os registros abaixo são fictícios.</DemoNotice>
      <div className="mb-4 flex flex-wrap gap-3">
        <SearchInput value={q} onChange={setQ} label="Buscar por responsável ou código" />
        <Select aria-label="Filtrar por situação" value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">Todas as situações</option><option>Ativa</option><option>Em acompanhamento</option><option>Inativa</option>
        </Select>
        <Select aria-label="Filtrar por bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="w-auto">
          <option value="">Todos os bairros</option>{bairros.map((b) => <option key={b}>{b}</option>)}
        </Select>
      </div>
      <p className="mb-2 text-sm text-muted-foreground" aria-live="polite">{lista.length} família(s) encontrada(s)</p>
      {lista.length === 0 ? <Empty>Nenhuma família encontrada com esses filtros.</Empty> : (
        <Table head={["Código", "Responsável", "Bairro", "Integrantes", "Cadastro", "Situação", ""]}>
          {lista.map((f) => (
            <tr key={f.id} className="hover:bg-muted/40">
              <td className={td + " font-mono text-xs"}>{f.codigo}</td>
              <td className={td + " font-medium"}>{f.responsavel}</td>
              <td className={td}>{f.bairro}</td>
              <td className={td}>{repo.pessoasDaFamilia(f.id).length}</td>
              <td className={td}>{dataBR(f.dataCadastro)}</td>
              <td className={td}><Badge tone={statusTone[f.status]}>{f.status}</Badge></td>
              <td className={td}><Link to="/familias/$id" params={{ id: f.id }} className="font-semibold text-primary hover:underline">Abrir ficha</Link></td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
