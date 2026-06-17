import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({
      to:
        typeof window !== "undefined" && localStorage.getItem("bnp_admin_logged_in")
          ? "/admin/dashboard"
          : "/admin/login",
    });
  },
});
