import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { STUCK } from "@/lib/links";
import { submitEnquiry } from "@/lib/enquiries.functions";
import { StackedCards } from "@/components/stacked-cards";
import { Button } from "@/components/ui/button";
import { CalendarDays, ClipboardList, Check, UserRound, Mail, Building2, Target, Globe, MessageSquare, BriefcaseBusiness, ChevronDown, LockKeyhole, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/logo-transparent.png";

export const field = "w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

export function F({ label, children }: { label: string; children: ReactNode }) {
  const Icon = /email/i.test(label) ? Mail : /name/i.test(label) ? (/business/i.test(label) ? Building2 : UserRound) : /whatsapp/i.test(label) ? WhatsAppIcon : /website|linkedin/i.test(label) ? Globe : /achieve|target/i.test(label) ? Target : /sell|do\?/i.test(label) ? BriefcaseBusiness : MessageSquare;
  return (
    <label className="form-field block">
      <span className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-foreground"><Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />{label}</span>
      {children}
    </label>
  );
}

export function Options({ name, label, options, placeholder }: { name: string; label: string; options: string[]; placeholder: string }) {
  return (
    <F label={label}>
      <div className="relative"><select name={name} required defaultValue="" className={field + " appearance-none !pr-12"}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" /></div>
    </F>
  );
}

export function StuckPicker({ label, grouped = false }: { label: string; grouped?: boolean }) {
  const [sel, setSel] = useState<string[]>([]);
  if (grouped) {
    const groups = [
      { title: "Getting attention", options: STUCK.slice(0, 5) },
      { title: "Turning it into clients", options: STUCK.slice(5, 11) },
      { title: null, options: STUCK.slice(11) },
    ];
    return <fieldset className="form-choices">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="rounded-2xl border border-border px-3 py-4 sm:px-5">
        {groups.map((group, index) => <div key={index} className={index === 2 ? "mt-3 border-t border-border pt-3" : index > 0 ? "mt-5" : ""}>
          {group.title && <p className="mb-2 px-2 font-display text-xs font-bold uppercase text-primary">{group.title}</p>}
          <div className="space-y-1">{group.options.map(option => {
            const checked = sel.includes(option);
            return <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-2 py-3 text-sm leading-relaxed transition-colors hover:bg-muted ${checked ? "bg-blush text-foreground" : "text-foreground"}`}>
              <Checkbox checked={checked} onCheckedChange={value => setSel(value === true ? [...sel, option] : sel.filter(item => item !== option))} className="h-5 w-5 rounded-md border-input shadow-none data-[state=checked]:border-primary" />
              <span>{option}</span>
            </label>;
          })}</div>
        </div>)}
      </div>
      {sel.map(option => <input key={option} type="hidden" name="stuck" value={option} />)}
    </fieldset>;
  }
  return (
    <fieldset className="form-choices">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {STUCK.map((s) => {
          const on = sel.includes(s);
          return (
            <Button variant="outline" type="button" key={s} aria-pressed={on}
              onClick={() => setSel(on ? sel.filter((x) => x !== s) : [...sel, s])}
              className={`!h-auto min-h-12 !justify-start !whitespace-normal rounded-xl border px-3.5 py-3 !text-left text-sm transition ${on ? "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "border-input bg-card hover:border-primary"}`}>
              <span className="choice-check" aria-hidden="true">{on && <Check className="h-3 w-3" />}</span><span>{s}</span>
            </Button>
          );
        })}
      </div>
      {sel.map((s) => <input key={s} type="hidden" name="stuck" value={s} />)}
    </fieldset>
  );
}

export function FormShell({ eyebrow, title, intro, steps, children, startAtForm = false }: { eyebrow?: string; title: string; intro: string; steps: string[]; children: ReactNode; startAtForm?: boolean }) {
  const [stage, setStage] = useState<"steps" | "form">("steps");
  const showForm = startAtForm || stage === "form";
  const go = (s: "steps" | "form") => {
    if (s === "form") window.history.pushState({ ...window.history.state, bookingStage: "form" }, "");
    else if (window.history.state?.bookingStage === "form") { window.history.back(); return; }
    setStage(s); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Phone/browser back from the form returns to the steps instead of leaving the page.
  useEffect(() => {
    const onPop = () => { setStage(window.history.state?.bookingStage === "form" ? "form" : "steps"); window.scrollTo({ top: 0 }); };
    window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop);
  }, []);
  if (!showForm) return (
    <main className="booking-shell mx-auto max-w-3xl px-5 py-10 md:py-16">
      <Link to="/book" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back to sessions</Link>
      {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
      <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      <div className="mt-10">
        <p className="eyebrow">What happens next</p>
        <div className="mt-7"><StackedCards label="booking step" items={steps.map((s, i) => {
          const Icon = [ClipboardList, CalendarDays, Check][i] ?? Check;
          return <><div className="stack-badge"><Icon className="h-10 w-10" /><span className="stack-number">{i + 1}</span></div><span className="stack-step mt-6">Step {String(i + 1).padStart(2, "0")}</span><p className="mt-6 text-xl font-semibold leading-relaxed">{s}</p></>;
        })} /></div>
      </div>
      <button type="button" onClick={() => go("form")} className="xray-continue group mt-10 inline-flex h-14 w-full items-center justify-center bg-primary px-8 text-base text-primary-foreground md:w-auto">
        Next<span className="xray-continue-arrow ml-3"><ArrowRight className="h-4 w-4" /></span>
      </button>
    </main>
  );
  return (
    <main className="booking-shell mx-auto max-w-3xl px-5 py-10 md:py-16">
      {startAtForm ? <Link to="/book" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back to sessions</Link> : <button type="button" onClick={() => go("steps")} className="block text-sm font-semibold text-muted-foreground hover:text-primary">← Back to steps</button>}
      {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
      <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-4xl">{title}</h1>
      <div className="form-panel mt-8 overflow-hidden rounded-3xl border border-border bg-card p-6 md:p-9">
        <div className="form-brand mb-8 flex items-center gap-5 border-b border-border pb-6"><img src={logo} alt="The Sales Doctor" className="h-16 w-28 object-contain" /><span className="h-px flex-1 bg-border" aria-hidden="true" /><ClipboardList aria-hidden="true" className="h-6 w-6 text-primary" /></div>
        {children}
      </div>
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

export const privacy = <p className="mt-3 flex items-start justify-center gap-2 text-center text-xs text-muted-foreground"><LockKeyhole aria-hidden="true" className="h-4 w-4 shrink-0" />Your details are only used to prepare for your session.</p>;
