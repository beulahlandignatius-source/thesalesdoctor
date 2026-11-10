import { createFileRoute } from "@tanstack/react-router";
import { PasswordForm } from "@/components/admin/PasswordForm";

export const Route = createFileRoute("/admin/password")({
  head: () => ({ meta: [
    { title: "Change password — Sales Admin" },
    { name: "description", content: "Securely update your Sales Clinic administrator password." },
    { property: "og:title", content: "Change password — Sales Admin" },
    { property: "og:description", content: "Secure password management for Sales Clinic administrators." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: () => (
    <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-foreground">Change password</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Confirm your current password, then choose a new one.</p>
      <PasswordForm requireCurrent />
    </div>
  ),
});
