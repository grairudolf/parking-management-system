import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => <Outlet />,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("parkcar_auth");
      if (!raw) throw redirect({ to: "/" });
    }
  },
});
