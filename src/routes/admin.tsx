import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { backend as supabase } from "@/lib/backend/client";
import { checkAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-transparent.png";
import { AdminNav } from "@/components/admin/AdminNav";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | The Sales Clinic & Client X-Ray" },
      { name: "description", content: "Private admin area for reviewing completed Client X-Rays." },
      { property: "og:title", content: "Admin Dashboard | The Client X-Ray" },
      { property: "og:description", content: "Private admin area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const qc = useQueryClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setAdmin(null);
    if (!session) return;
    checkAdmin()
      .then((r) => setAdmin(r.isAdmin))
      .catch(() => setAdmin(false));
  }, [session?.user.id]);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
  };

  if (session === undefined || (session && admin === null))
    return (
      <Center>
        <p role="status" className="text-muted-foreground">
          Loading…
        </p>
      </Center>
    );
  if (!session) return <Login />;
  if (!admin)
    return (
      <Center>
        <p className="text-foreground">This account doesn't have admin access.</p>
        <Button variant="premium" onClick={signOut} className="btn-primary mt-6 w-full">
          Sign out
        </Button>
      </Center>
    );

  return (
    <div className="admin-shell min-h-dvh bg-background">
      <AdminNav onSignOut={signOut} email={session.user.email ?? ""} />
      <div className="admin-content mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:pb-10 lg:pt-10">
        <Outlet />
      </div>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-signin flex min-h-dvh items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm text-center">
        <img src={logo} alt="The Sales Doctor" className="mx-auto mb-8 w-28" />
        {children}
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr("Incorrect email or password.");
    setBusy(false);
  };
  return (
    <Center>
      <h1 className="font-display text-2xl font-semibold uppercase text-primary">
        The Sales Clinic
      </h1>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        Admin sign in
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4 text-left">
        <label className="block">
          <span className="text-sm text-muted-foreground">Email</span>
          <input
            autoComplete="username"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field mt-1"
          />
        </label>
        <label className="block">
          <span className="text-sm text-muted-foreground">Password</span>
          <input
            autoComplete="current-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field mt-1"
          />
        </label>
        {err && (
          <p role="alert" className="text-sm text-destructive">
            {err}
          </p>
        )}
        <Button type="submit" variant="premium" disabled={busy} className="btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <ForgotPassword initialEmail={email} />
    </Center>
  );
}

function ForgotPassword({ initialEmail }: { initialEmail: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open)
    return (
      <button
        type="button"
        onClick={() => { setEmail(initialEmail); setOpen(true); }}
        className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
      >
        Forgot password?
      </button>
    );
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) setErr("Couldn't send the reset email. Please try again in a minute.");
    else setSent(true);
  };
  return (
    <div className="mt-6 rounded-3xl border border-border bg-card p-5 text-left">
      {sent ? (
        <p role="status" className="text-sm text-foreground">
          If that email belongs to an admin, a reset link is on its way. Open it on this device to set a new password.
        </p>
      ) : (
        <form onSubmit={send} className="space-y-3">
          <p className="text-sm text-muted-foreground">Enter your admin email and we'll send a reset link.</p>
          <input type="email" required autoComplete="username" value={email}
            onChange={(e) => setEmail(e.target.value)} className="field" aria-label="Admin email" />
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          <Button type="submit" variant="premium" disabled={busy} className="btn-primary w-full">
            {busy ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </div>
  );
}
