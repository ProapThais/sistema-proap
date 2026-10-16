import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Table, td, Badge, pageHead } from "@/components/ui-kit";
import { repo } from "@/data/repository";

export const Route = createFileRoute("/turmas")({
  head: () => pageHead("Turmas", "Turmas fixas com professor, dias, horários, local e capacidade."),
  component: () => (
    <>
      <PageHeader title="Turmas fixas" description="Professores e locais fictícios." />
      <Table head={["Turma", "Modalidade", "Professor(a)", "Dias", "Horário", "Local", "Ocupação"]}>
        {repo.turmas().map((t) => {
          const ocup = repo.matriculas().filter((m) => m.turmaId === t.id && m.status === "Ativa").length;
          return (
            <tr key={t.id}>
              <td className={td + " font-medium"}>{t.nome}</td><td className={td}>{repo.modalidade(t.modalidadeId)?.nome}</td>
              <td className={td}>{t.professor}</td><td className={td}>{t.dias.join(", ")}</td><td className={td}>{t.horario}</td><td className={td}>{t.local}</td>
              <td className={td}><Badge tone={ocup >= t.capacidade ? "danger" : "success"}>{ocup}/{t.capacidade}</Badge></td>
            </tr>
          );
        })}
      </Table>
    </>
  ),
});
