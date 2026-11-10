import { useState } from "react";
import { backend as supabase } from "@/lib/backend/client";
import { Button } from "@/components/ui/button";

/** Sets a new password. `requireCurrent` = signed-in change (verifies current password first). */
export function PasswordForm({ requireCurrent, onDone }: { requireCurrent: boolean; onDone?: () => void }) {
  const [current, setCurrent] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (pw.length < 10) return setErr("Use at least 10 characters.");
    if (pw !== pw2) return setErr("The two new passwords don't match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser(
      requireCurrent ? ({ password: pw, current_password: current } as { password: string }) : { password: pw },
    );
    setBusy(false);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes("current")) setErr("Your current password is incorrect.");
      else if (m.includes("weak") || m.includes("pwned") || m.includes("leaked"))
        setErr("That password is too common or has appeared in a data leak. Choose a stronger one.");
      else if (m.includes("same")) setErr("Choose a password different from your current one.");
      else setErr("Couldn't update the password. Please try again.");
      return;
    }
    setOk(true);
    setCurrent(""); setPw(""); setPw2("");
    onDone?.();
  };

  if (ok) return <p role="status" className="rounded-3xl bg-blush p-5 text-sm font-semibold text-primary">Password updated. Use it next time you sign in.</p>;

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      {requireCurrent && (
        <label className="block">
          <span className="text-sm text-muted-foreground">Current password</span>
          <input type="password" required autoComplete="current-password" value={current}
            onChange={(e) => setCurrent(e.target.value)} className="field mt-1" />
        </label>
      )}
      <label className="block">
        <span className="text-sm text-muted-foreground">New password</span>
        <input type="password" required minLength={10} autoComplete="new-password" value={pw}
          onChange={(e) => setPw(e.target.value)} className="field mt-1" />
      </label>
      <label className="block">
        <span className="text-sm text-muted-foreground">Repeat new password</span>
        <input type="password" required minLength={10} autoComplete="new-password" value={pw2}
          onChange={(e) => setPw2(e.target.value)} className="field mt-1" />
      </label>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <Button type="submit" variant="premium" disabled={busy} className="btn-primary w-full">
        {busy ? "Saving…" : "Save new password"}
      </Button>
    </form>
  );
}
