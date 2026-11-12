import { F, field } from "@/components/form-bits";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { startAuditSession, updateAuditInfo, saveAuditAnswer, getAuditSession, submitAuditForReview } from "@/lib/audit-session.functions";
import { XraySubmissionModal } from "@/components/xray-submission-modal";
import { QUESTIONS, loadState, saveState, emptyState, type AuditState, type BasicInfo } from "@/lib/audit";
import { AUDIT_PAGES, pageForStep, stepForPage, questionsForPage, pageAnswersValid, stageProgress } from "@/lib/audit-pages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ScanLine } from "lucide-react";
import { DiagnosticGuide, DiagnosticSweep } from "@/components/diagnostic-guide";
import { XrayTopicQuestion } from "@/components/xray-topic-question";

export const Route = createFileRoute("/audit")({
  head: () => ({ meta: [
    { title: "Your Business Assessment | The Client X-Ray" },
    { name: "description", content: "Examine your business in six organised stages, from your market and offer to sales, follow-up and revenue." },
    { property: "og:title", content: "Your Business Assessment | The Client X-Ray" },
    { property: "og:description", content: "A six-stage examination of your client acquisition process with Dr. Dan." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Audit,
});

export function Audit() {
  const nav = useNavigate();
  const [s, setS] = useState<AuditState>(emptyState());
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<"scanning" | "complete" | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const workspace = useRef<HTMLDivElement>(null);
  const formStarted = useRef(false);
  const submitting = useRef(false);
  useEffect(() => {
    let active = true;
    const local = loadState(); setS(local);
    if (!local.session) { setReady(true); return; }
    getAuditSession({ data: local.session }).then(r => {
      if (!active) return;
      if (r.completed) { void nav({ to: "/results", replace: true }); return; }
      setS(cur => ({ ...cur, info: r.info, answers: { ...r.answers, ...cur.answers }, step: Object.keys(local.answers).length ? local.step : r.step }));
    }).catch(() => { if (active) setError("We couldn't reconnect to your saved X-Ray. Your answers are still here. Please check your connection and try again."); })
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);
  useEffect(() => { if (ready) saveState(s); }, [s, ready]);
  const page = pageForStep(s.step);
  const topic = AUDIT_PAGES[page] ?? AUDIT_PAGES[0];
  const questions = questionsForPage(page);
  const isLast = page === AUDIT_PAGES.length - 1;
  const progress = stageProgress(receipt ? AUDIT_PAGES.length : page);
  const infoValid = !!s.info.name.trim() && /^\S+@\S+\.\S+$/.test(s.info.email.trim()) && s.info.whatsapp.replace(/\D/g, "").length >= 7;
  const canContinue = page === 0 ? infoValid : pageAnswersValid(page, s.answers);
  useEffect(() => {
    if (ready) { workspace.current?.scrollTo?.(0, 0); heading.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }, [page, ready]);
  const setInfo = (key: keyof BasicInfo, value: string) => {
    if (!formStarted.current) { formStarted.current = true; window.__lovableEvents?.track?.("project.xray_form_started", {}); }
    setS(cur => ({ ...cur, info: { ...cur.info, [key]: value } }));
  };
  const next = async () => {
    if (!ready || !canContinue || submitting.current || receipt) return;
    submitting.current = true; setBusy(true); setError("");
    try {
      if (page === 0) {
        const info = { name: s.info.name.trim(), email: s.info.email.trim(), whatsapp: s.info.whatsapp.trim() };
        let session = s.session;
        if (session) await updateAuditInfo({ data: { ...session, info } });
        else { session = await startAuditSession({ data: { info } }); window.__lovableEvents?.track?.("project.xray_started", {}); }
        setS(cur => ({ ...cur, session, step: stepForPage(1) }));
      } else {
        const ref = s.session;
        if (!ref) throw new Error("Missing assessment session");
        const nextStep = isLast ? QUESTIONS.length : stepForPage(page + 1);
        // The existing answer endpoint and original question IDs remain authoritative.
        // Re-sync all answers on final submission; empty multi-selections clear stored answers.
        const toSave = isLast ? QUESTIONS.filter(q => s.answers[q.id] !== undefined) : questions;
        await Promise.all(toSave.map(q => saveAuditAnswer({ data: { ...ref, questionId: q.id, answer: s.answers[q.id] ?? "", step: nextStep } })));
        if (isLast) {
          await submitAuditForReview({ data: ref });
          window.__lovableEvents?.track?.("project.xray_form_submitted", {});
          saveState(s);
          try { localStorage.removeItem("client-xray-diagnosis"); } catch {}
          setReceipt("scanning");
        } else setS(cur => ({ ...cur, step: nextStep }));
      }
    } catch { setError(page === 0 ? "Something went wrong. Please try again." : "We couldn't save your answers. Please check your connection and try again."); }
    finally { submitting.current = false; setBusy(false); }
  };
  const back = () => {
    if (busy) return;
    setError("");
    if (page === 0) nav({ to: "/xray" });
    else setS(cur => ({ ...cur, step: stepForPage(page - 1) }));
  };
  return <div className={`min-h-dvh bg-background xray-ambient mobile-assessment xray-topic-assessment ${page === 0 ? "assessment-contact-screen" : ""}`}>
    {receipt && <XraySubmissionModal onComplete={() => { void nav({ to: "/results", replace: true }); }} />}
    <DiagnosticSweep repeat />
    <div ref={workspace} className="assessment-workspace mx-auto flex min-h-dvh max-w-3xl flex-col px-6 pb-32 pt-5 sm:pt-28">
      <header className="xray-bar flex items-center justify-between gap-3">
        <Link to="/xray" className="flex items-center gap-2 font-display text-sm font-semibold text-primary"><ScanLine className="h-4 w-4" /> Client X-Ray</Link>
      </header>
        <div className="assessment-progress mt-5" aria-live="polite" aria-atomic="true">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-xs">
            <h1 ref={heading} tabIndex={-1} className="min-w-0 font-display text-lg font-semibold leading-snug text-foreground sm:text-2xl">{topic.title} <span className="whitespace-nowrap text-xs font-normal text-muted-foreground">· {page + 1}/{AUDIT_PAGES.length}</span></h1>
            <span className="shrink-0 font-semibold tabular-nums text-primary">{progress.percent}% complete</span>
          </div>
          <div role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent} aria-valuetext={`${progress.percent}% complete. Stage ${page + 1} of ${AUDIT_PAGES.length}: ${topic.title}. ${progress.remaining} stages remaining including this one.`} className="mt-2 flex gap-1.5">
            {AUDIT_PAGES.map((stage, index) => <span key={stage.title} className={`h-1.5 min-w-0 flex-1 rounded-full transition-colors motion-reduce:transition-none ${index < page || receipt ? "bg-primary" : index === page ? "bg-primary/35" : "bg-muted"}`} />)}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{receipt ? "All stages submitted" : isLast ? "Final stage" : `${progress.remaining} stages remaining, including this one`}</p>
        </div>
      <div key={page} className="assessment-question mt-5 animate-in fade-in duration-300">
        <p className="text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
        {page > 0 && <p className="mt-3 text-xs tabular-nums text-muted-foreground">{questions.filter(q => !!s.answers[q.id]?.trim()).length} of {questions.length} answered</p>}
        {page === 0 ? <div className="mt-6 space-y-3">
          {([["name", "Your name", "text"], ["email", "Email address", "email"], ["whatsapp", "WhatsApp number", "tel"]] as const).map(([key, label, type]) => <F key={key} label={label} compact>
            <input id={`info-${key}`} type={type} required autoComplete={key === "whatsapp" ? "tel" : key} maxLength={key === "email" ? 255 : 100} disabled={busy || !ready} value={s.info[key]} onChange={e => setInfo(key, e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void next(); } }} placeholder={key === "whatsapp" ? "+234 800 000 0000" : undefined} className={field} onBlur={e => {
              const value = e.currentTarget.value.trim();
              const valid = key === "name" ? !!value : key === "email" ? /^\S+@\S+\.\S+$/.test(value) : value.replace(/\D/g, "").length >= 7;
              if (!valid) window.__lovableEvents?.track?.("project.xray_validation_error", { stage: "contact", field: key, reason: value ? "invalid_format" : "required" });
            }} />
          </F>)}
        </div> : <div className="xray-topic-fields mt-8">
          {questions.map(q => <XrayTopicQuestion key={q.id} question={q} answer={s.answers[q.id] ?? ""} busy={busy || !ready} onAnswer={value => setS(cur => ({ ...cur, answers: { ...cur.answers, [q.id]: value } }))} />)}
        </div>}
      </div>
      {(page === 0 || page === 3) && <div className="assessment-guide mt-6"><DiagnosticGuide compact mood={busy ? "examining" : page === 0 ? "welcome" : "thinking"} scanning={busy} message={page === 0 ? "Let's take an X-ray of your business!" : "Let's see what's happening inside your business."} /></div>}
    </div>
    <div className="assessment-actions fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-5 pb-3 pt-3">
        {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-3">
          <Button onClick={back} variant="outline" disabled={busy} className="h-12 shrink-0"><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button variant="premium" onClick={() => void next()} disabled={!canContinue || busy || !ready} className="xray-continue group h-12 min-w-0 flex-1 text-sm">{busy ? "Saving…" : isLast ? "See my X-Ray" : "Continue"}<span className="xray-continue-arrow ml-2"><ArrowRight className="h-4 w-4" /></span></Button>
        </div>
      </div>
    </div>
  </div>;
}
