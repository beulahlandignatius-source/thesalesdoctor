import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { backend as supabase } from "@/lib/backend/client";
import { PasswordForm } from "@/components/admin/PasswordForm";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset admin password | The Sales Clinic" },
      { name: "description", content: "Set a new password for your Sales Clinic admin account." },
      { property: "og:title", content: "Reset admin password | The Sales Clinic" },
      { property: "og:description", content: "Set a new admin password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState<boolean | null>(null);
  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery") || window.location.search.includes("code=");
    const { data: sub } = supabase.auth.onAuthStateChange((e) => {
      if (e === "PASSWORD_RECOVERY" || e === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session || (isRecovery ? null : false)));
    const t = setTimeout(() => setReady((r) => (r === null ? false : r)), 4000);
    return () => { sub.subscription.unsubscribe(); clearTimeout(t); };
  }, []);

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold text-foreground">Set a new password</h1>
        {ready === null && <p role="status" className="mt-4 text-sm text-muted-foreground">Checking your reset link…</p>}
        {ready === false && (
          <p className="mt-4 text-sm text-muted-foreground">
            This reset link is invalid or has expired. Request a new one from the{" "}
            <Link to="/admin" className="font-semibold text-primary underline">admin sign-in page</Link>.
          </p>
        )}
        {ready && (
          <div className="mt-6">
            <PasswordForm requireCurrent={false} />
            <Link to="/admin" className="mt-5 inline-block text-sm font-semibold text-primary underline">Go to admin</Link>
          </div>
        )}
      </div>
    </main>
  );
}
