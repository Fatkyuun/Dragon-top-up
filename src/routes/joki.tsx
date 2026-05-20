import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/joki")({
  head: () => ({
    meta: [
      { title: "Jasa Joki Profesional — NeonTopUp" },
      {
        name: "description",
        content:
          "Jasa joki game profesional, aman & anti-ban. Pilih game, bayar, dan biarkan pro player kami yang bermain. Support 24/7.",
      },
    ],
  }),
  component: JokiLayout,
});

function JokiLayout() {
  return <Outlet />;
}
