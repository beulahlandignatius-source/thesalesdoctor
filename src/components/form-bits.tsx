import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { STUCK } from "@/lib/links";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { StackedCards } from "@/components/stacked-cards";
import { Button } from "@/components/ui/button";
import { CalendarDays, ClipboardList, Check } from "lucide-react";

export const field = "w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function F({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Options({ name, label, options, placeholder }: { name: string; label: string; options: string[]; placeholder: string }) {
  return (
    <F label={label}>
      <select name={name} required defaultValue="" className={field}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </F>
  );
}

export function StuckPicker({ label }: { label: string }) {
  const [sel, setSel] = useState<string[]>([]);
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {STUCK.map((s) => {
          const on = sel.includes(s);
          return (
            <Button variant="outline" type="button" key={s} aria-pressed={on}
              onClick={() => setSel(on ? sel.filter((x) => x !== s) : [...sel, s])}
              className={`rounded-full border px-3.5 py-2 text-sm transition ${on ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card hover:border-primary"}`}>
              {s}
            </Button>
          );
        })}
      </div>
      {sel.map((s) => <input key={s} type="hidden" name="stuck" value={s} />)}
    </fieldset>
  );
}

export function FormShell({ eyebrow, title, intro, steps, children }: { eyebrow?: string; title: string; intro: string; steps: string[]; children: ReactNode }) {
  return (
    <main className="booking-shell mx-auto grid max-w-6xl gap-10 px-5 py-10 md:grid-cols-[1fr_1.3fr] md:gap-16 md:py-16">
      <div>
        <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back to The Sales Clinic</Link>
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
        <div className="mt-10">
          <p className="eyebrow">What happens next</p>
          <div className="mt-7"><StackedCards label="booking step" items={steps.map((s, i) => {
            const Icon = [ClipboardList, CalendarDays, Check][i] ?? Check;
            return <><div className="stack-badge"><Icon className="h-10 w-10" /><span className="stack-number">{i + 1}</span></div><span className="stack-step mt-6">Step {String(i + 1).padStart(2, "0")}</span><p className="mt-6 text-xl font-semibold leading-relaxed">{s}</p></>;
          })} /></div>
        </div>
      </div>
      <div className="form-panel self-start rounded-3xl border border-border bg-card p-6 md:p-9">{children}</div>
    </main>
  );
}

type Kind = "free_review" | "private_clinic" | "mentorship";

/** Save a Sales Clinic form to the backend. Returns the person's name/email for the next step. */
export function useEnquiry(kind: Kind) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(form: HTMLFormElement) {
    const d = new FormData(form);
    const details: Record<string, string | string[]> = {};
    for (const [k, v] of d.entries()) {
      if (["name", "email", "phone"].includes(k)) continue;
      const val = String(v);
      if (k === "stuck") details["stuck"] = [...((details["stuck"] as string[] | undefined) ?? []), val];
      else details[k] = val;
    }
    const who = { name: String(d.get("name")).trim(), email: String(d.get("email")).trim() };
    setBusy(true);
    setError("");
    try {
      await submitEnquiry({ data: { kind, ...who, whatsapp: String(d.get("phone")).trim(), details } });
      window.__lovableEvents?.track?.("project.enquiry_submitted", { kind });
      return who;
    } catch {
      setError("Something went wrong saving your details. Please check them and try again.");
      return null;
    } finally {
      setBusy(false);
    }
  }
  return { save, busy, error };
}

export function FormError({ msg }: { msg: string }) {
  return msg ? <p role="alert" className="rounded-md bg-blush p-3 text-sm text-destructive">{msg}</p> : null;
}

export const privacy = <p className="mt-3 text-center text-xs text-muted-foreground">Your details are only used to prepare for your session.</p>;
