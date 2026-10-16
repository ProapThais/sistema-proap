import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, pageHead } from "@/components/ui-kit";
import { FamiliaForm } from "@/components/FamiliaForm";

export const Route = createFileRoute("/familias/nova")({
  head: () => pageHead("Cadastrar família", "Formulário de cadastro de família com verificação de duplicidade."),
  component: () => (
    <>
      <PageHeader title="Cadastrar família" description="Campos com * são obrigatórios. O sistema avisa se encontrar um cadastro parecido." />
      <FamiliaForm />
    </>
  ),
});
