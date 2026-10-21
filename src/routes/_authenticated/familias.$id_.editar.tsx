import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageHeader, pageHead } from "@/components/ui-kit";
import { FamiliaForm } from "@/components/FamiliaForm";
import { repo } from "@/data/repository";

export const Route = createFileRoute("/_authenticated/familias/$id_/editar")({
  loader: ({ params }) => {
    const familia = repo.familia(params.id);
    if (!familia) throw notFound();
    return { familia };
  },
  head: () => pageHead("Editar família", "Edição dos dados de uma família (demonstração)."),
  component: Editar,
});

function Editar() {
  const { familia } = Route.useLoaderData();
  return (
    <>
      <PageHeader title="Editar família" description={`${familia.codigo} — ${familia.responsavel}`} />
      <FamiliaForm inicial={familia} />
    </>
  );
}
