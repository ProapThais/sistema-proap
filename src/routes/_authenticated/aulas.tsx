import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Badge, pageHead } from "@/components/ui-kit";
import { repo } from "@/data/repository";

export const Route = createFileRoute("/aulas")({
  head: () => pageHead("Aulas e modalidades", "Modalidades educacionais, esportivas e culturais oferecidas (demonstração)."),
  component: () => (
    <>
      <PageHeader title="Aulas e modalidades" description="Modalidades de exemplo oferecidas pelo projeto." />
      <div className="grid gap-4 sm:grid-cols-2">
        {repo.modalidades().map((m) => {
          const turmas = repo.turmas().filter((t) => t.modalidadeId === m.id);
          return (
            <Card key={m.id}>
              <Badge tone="accent">{m.area}</Badge>
              <h2 className="mt-2 text-xl font-semibold">{m.nome}</h2>
              <p className="text-sm text-muted-foreground">{m.descricao}</p>
              <p className="mt-3 text-sm"><strong>{turmas.length}</strong> turma(s): {turmas.map((t) => t.nome).join(", ")}</p>
            </Card>
          );
        })}
      </div>
    </>
  ),
});
