import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, Card, Field, Select, Input, Btn, Badge, statusTone, Empty, pageHead } from "@/components/ui-kit";
import { repo } from "@/data/repository";
import type { Presenca } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/frequencia")({
  head: () => pageHead("Frequência", "Registro de frequência por encontro: presença, falta, falta justificada ou aula cancelada."),
  component: Frequencia,
});

const opcoes: Presenca[] = ["Presente", "Falta", "Falta justificada"];

function Frequencia() {
  const [turmaId, setTurmaId] = useState(repo.turmas()[0].id);
  const [data, setData] = useState("2026-10-16");
  const [cancelada, setCancelada] = useState(false);
  const [marc, setMarc] = useState<Record<string, Presenca>>({});
  const [msg, setMsg] = useState("");
  const alunos = repo.matriculas().filter((m) => m.turmaId === turmaId && m.status === "Ativa");
  const pendentes = alunos.filter((a) => !marc[a.id]).length;

  return (
    <>
      <PageHeader title="Frequência por encontro" description="Escolha a turma e a data do encontro." />
      <Card className="mb-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Turma" id="turma"><Select id="turma" value={turmaId} onChange={(e) => { setTurmaId(e.target.value); setMarc({}); setMsg(""); }}>{repo.turmas().map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</Select></Field>
          <Field label="Data do encontro" id="data"><Input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} /></Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium"><input type="checkbox" checked={cancelada} onChange={(e) => setCancelada(e.target.checked)} className="h-4 w-4" /> Aula cancelada</label>
        </div>
      </Card>

      {cancelada ? (
        <Card><Badge tone="neutral">Aula cancelada</Badge><p className="mt-2 text-sm">Neste encontro nenhuma presença ou falta será registrada.</p></Card>
      ) : alunos.length === 0 ? <Empty>Nenhum aluno com matrícula ativa nesta turma.</Empty> : (
        <ul className="space-y-2">
          {alunos.map((a) => (
            <li key={a.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-medium">{repo.pessoa(a.pessoaId)?.nome}</span>
                <fieldset className="flex flex-wrap gap-2">
                  <legend className="sr-only">Frequência de {repo.pessoa(a.pessoaId)?.nome}</legend>
                  {opcoes.map((o) => (
                    <label key={o} className={cn("cursor-pointer rounded-lg border px-3 py-1.5 text-sm", marc[a.id] === o ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>
                      <input type="radio" name={`p-${a.id}`} className="sr-only" checked={marc[a.id] === o} onChange={() => setMarc({ ...marc, [a.id]: o })} />{o}
                    </label>
                  ))}
                </fieldset>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
        {!cancelada && pendentes > 0 && <span className="text-sm text-muted-foreground">{pendentes} aluno(s) sem marcação</span>}
        <Btn disabled={!cancelada && pendentes > 0} onClick={() => setMsg("Simulação: frequência registrada apenas na tela (não há banco de dados nesta etapa).")}>Registrar frequência</Btn>
      </div>
      {msg && <p role="status" className="mt-3 text-right text-sm text-success">{msg}</p>}
      {!cancelada && Object.keys(marc).length > 0 && (
        <div className="mt-4 flex flex-wrap justify-end gap-2">{opcoes.map((o) => <Badge key={o} tone={statusTone[o]}>{o}: {Object.values(marc).filter((v) => v === o).length}</Badge>)}</div>
      )}
    </>
  );
}
