import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Table, td, Badge, Card, pageHead } from "@/components/ui-kit";
import { repo } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/administracao")({
  head: () => pageHead("Usuários e perfis", "Administração de usuários e perfis de acesso (demonstração)."),
  component: Admin,
});

const perfis = [
  ["Administrador", "Gerencia usuários, perfis e todas as áreas."],
  ["Assistente social", "Famílias, demandas, atendimentos e encaminhamentos."],
  ["Educador", "Turmas, matrículas e frequência das suas turmas."],
  ["Recepção", "Consulta e pré-cadastro de famílias."],
];

function Admin() {
  return (
    <>
      <PageHeader title="Usuários e perfis" description="Tela ilustrativa. O controle de acesso real será implementado com autenticação segura em etapa futura." />
      <p role="note" className="mb-5 rounded-lg border border-info/40 bg-info/10 px-4 py-2.5 text-sm">Esta tela não concede nem restringe acesso: não há autenticação nesta versão.</p>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {perfis.map(([p, d]) => <Card key={p}><h2 className="font-semibold">{p}</h2><p className="mt-1 text-sm text-muted-foreground">{d}</p></Card>)}
      </div>
      <Table head={["Nome", "E-mail (fictício)", "Perfil", "Situação"]}>
        {repo.usuarios().map((u) => (
          <tr key={u.id}><td className={td + " font-medium"}>{u.nome}</td><td className={td}>{u.email}</td><td className={td}>{u.perfil}</td>
            <td className={td}><Badge tone={u.ativo ? "success" : "neutral"}>{u.ativo ? "Ativo" : "Inativo"}</Badge></td></tr>
        ))}
      </Table>
    </>
  );
}
