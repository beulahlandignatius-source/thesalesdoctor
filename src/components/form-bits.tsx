import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { STUCK } from "@/lib/links";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const field = "clinic-field w-full min-h-13 rounded-md border border-input bg-background px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

export function F({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-sm font-medium text-foreground">{label}</span>
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
      <div className="grid gap-2 sm:grid-cols-2">
        {STUCK.map((s) => {
          const on = sel.includes(s);
          return (
            <Button variant="ghost" type="button" key={s} aria-pressed={on}
              onClick={() => setSel(on ? sel.filter((x) => x !== s) : [...sel, s])}
              className={`min-h-13 h-auto justify-start whitespace-normal rounded-md border px-3.5 py-3 text-left text-sm font-normal transition ${on ? "border-primary bg-blush text-foreground hover:bg-blush" : "border-input bg-background hover:border-primary hover:bg-muted"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${on ? "border-primary bg-primary text-primary-foreground" : "border-input"}`} aria-hidden="true">{on && <Check className="h-3 w-3" />}</span>
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
    <main className="journey-shell mx-auto grid max-w-7xl gap-10 px-6 py-10 md:gap-16 md:px-10 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
      <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
        <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back to The Sales Clinic</Link>
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className="mt-5 text-4xl font-bold leading-[1.08] md:text-5xl">{title}</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        <div className="mt-10 border-t border-border pt-7">
          <p className="eyebrow">What happens next</p>
          <ol className="mt-6 space-y-5">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush font-display text-sm font-bold text-primary">{i + 1}</span>
                <span className="pt-0.5">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="journey-form min-w-0 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">{children}</div>
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
