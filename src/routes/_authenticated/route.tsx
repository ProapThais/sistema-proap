import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

// Proteção de interface: quem não estiver conectado é direcionado para /entrar.
// Isto NÃO substitui a segurança no servidor e no banco (Blocos 1B/1C).
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      throw redirect({ to: "/entrar", search: { redirect: location.href } });
    }
  },
  component: () => <Outlet />,
});
