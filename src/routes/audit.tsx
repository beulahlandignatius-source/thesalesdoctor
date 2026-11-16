import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { startAuditSession, updateAuditInfo, saveAuditAnswers, getAuditSession, submitAuditForReview } from "@/lib/audit-session.functions";
import { XraySubmissionModal } from "@/components/xray-submission-modal";
import { OPTIONAL_IDS, QUESTIONS, loadState, saveState, emptyState, type AuditState, type BasicInfo } from "@/lib/audit";
import { AUDIT_PAGES, pageForStep, stepForPage, questionsForPage, pageAnswersValid, stageProgress } from "@/lib/audit-pages";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ScanLine } from "lucide-react";
import { DiagnosticSweep } from "@/components/diagnostic-guide";
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
  const pendingSaves = useRef<Promise<void>>(Promise.resolve());
  const sessionRef = useRef<AuditState["session"]>(undefined);
  const [qi, setQi] = useState(0);
  const advanceTimer = useRef<number | undefined>(undefined);
  const continueBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let active = true;
    const local = loadState(); setS(local); sessionRef.current = local.session;
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
  const resumed = useRef(false);
  useEffect(() => {
    if (!ready || resumed.current) return;
    resumed.current = true;
    const qs = questionsForPage(pageForStep(s.step));
    const open = qs.findIndex(q => !OPTIONAL_IDS.has(q.id) && !s.answers[q.id]?.trim());
    setQi(open >= 0 ? open : Math.max(0, qs.length - 1));
  }, [ready]);
  const page = pageForStep(s.step);
  const topic = AUDIT_PAGES[page] ?? AUDIT_PAGES[0];
  const questions = questionsForPage(page);
  const isLast = page === AUDIT_PAGES.length - 1;
  const progress = stageProgress(receipt ? AUDIT_PAGES.length : page);
  const infoValid = !!s.info.name.trim() && /^\S+@\S+\.\S+$/.test(s.info.email.trim()) && s.info.whatsapp.replace(/\D/g, "").length >= 7;
  const qIndex = Math.min(qi, Math.max(0, questions.length - 1));
  const current = questions[qIndex];
  const lastInPage = page === 0 || qIndex >= questions.length - 1;
  const currentValid = !current || OPTIONAL_IDS.has(current.id) || !!s.answers[current.id]?.trim();
  const canContinue = page === 0 ? infoValid : lastInPage ? pageAnswersValid(page, s.answers) : currentValid;
  useEffect(() => () => window.clearTimeout(advanceTimer.current), []);
  useEffect(() => {
    if (ready) { workspace.current?.scrollTo?.(0, 0); heading.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
  }, [page, ready]);
  useEffect(() => { if (ready && page > 0) workspace.current?.scrollTo?.(0, 0); }, [qIndex]);
  const setInfo = (key: keyof BasicInfo, value: string) => {
    if (!formStarted.current) { formStarted.current = true; window.__lovableEvents?.track?.("project.xray_form_started", {}); }
    setS(cur => ({ ...cur, info: { ...cur.info, [key]: value } }));
  };
  const ensureSession = async (snapshot: AuditState) => {
    if (sessionRef.current) return sessionRef.current;
    const info = { name: snapshot.info.name.trim(), email: snapshot.info.email.trim(), whatsapp: snapshot.info.whatsapp.trim() };
    const session = await startAuditSession({ data: { info } });
    sessionRef.current = session;
    setS(cur => { const updated = { ...cur, session }; saveState(updated); return updated; });
    window.__lovableEvents?.track?.("project.xray_started", {});
    return session;
  };
  const next = async () => {
    window.clearTimeout(advanceTimer.current);
    if (page > 0 && !lastInPage) { if (currentValid) setQi(qIndex + 1); return; }
    if (!ready || !canContinue || submitting.current || receipt) return;
    setError("");
    if (page === 0 || !isLast) {
      const snapshot = s;
      const nextStep = stepForPage(page + 1);
      setQi(0);
      setS(cur => { const updated = { ...cur, step: nextStep }; saveState(updated); return updated; });
      pendingSaves.current = pendingSaves.current.then(async () => {
        const session = await ensureSession(snapshot);
        if (page === 0) {
          await updateAuditInfo({ data: { ...session, info: { name: snapshot.info.name.trim(), email: snapshot.info.email.trim(), whatsapp: snapshot.info.whatsapp.trim() } } });
        } else {
          await saveAuditAnswers({ data: { ...session, step: nextStep, answers: questions.map(q => ({ questionId: q.id, answer: snapshot.answers[q.id] ?? "" })) } });
        }
      }).catch(() => setError("Your answers are kept on this device. We couldn't sync them yet. Please check your connection; we'll retry when you continue."));
      return;
    }
    submitting.current = true; setBusy(true);
    try {
      await pendingSaves.current;
      const ref = await ensureSession(s);
      await updateAuditInfo({ data: { ...ref, info: { name: s.info.name.trim(), email: s.info.email.trim(), whatsapp: s.info.whatsapp.trim() } } });
        const nextStep = isLast ? QUESTIONS.length : stepForPage(page + 1);
        // The existing answer endpoint and original question IDs remain authoritative.
        // Re-sync all answers on final submission; empty multi-selections clear stored answers.
        const toSave = isLast ? QUESTIONS.filter(q => s.answers[q.id] !== undefined) : questions;
        await saveAuditAnswers({ data: { ...ref, step: nextStep, answers: toSave.map(q => ({ questionId: q.id, answer: s.answers[q.id] ?? "" })) } });
        if (isLast) {
          await submitAuditForReview({ data: ref });
          window.__lovableEvents?.track?.("project.xray_form_submitted", {});
          saveState(s);
          try { localStorage.removeItem("client-xray-diagnosis"); } catch {}
          setReceipt("scanning");
        } else { setQi(0); setS(cur => ({ ...cur, step: nextStep })); }
    } catch { setError(page === 0 ? "Something went wrong. Please try again." : "We couldn't save your answers. Please check your connection and try again."); }
    finally { submitting.current = false; setBusy(false); }
  };
  const back = () => {
    if (busy) return;
    window.clearTimeout(advanceTimer.current);
    setError("");
    if (page > 0 && qIndex > 0) { setQi(qIndex - 1); return; }
    if (page === 0) nav({ to: "/xray" });
    else { setQi(Math.max(0, questionsForPage(page - 1).length - 1)); setS(cur => ({ ...cur, step: stepForPage(page - 1) })); }
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
          <svg viewBox="0 0 300 40" className="footer-ecg xray-assessment-ecg" aria-hidden="true" preserveAspectRatio="none"><path d="M0 26 H60 L70 26 L78 8 L86 36 L94 18 L102 26 H160 L170 26 L178 4 L186 38 L194 20 L202 26 H300" className="footer-ecg-trace" /><path d="M0 26 H60 L70 26 L78 8 L86 36 L94 18 L102 26 H160 L170 26 L178 4 L186 38 L194 20 L202 26 H300" className="footer-ecg-beat" pathLength={100} />
          </svg>
        </div>
      <div key={page} className="assessment-question mt-5 animate-in fade-in duration-300">
        <p className="text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
        {page === 0 ? <div className="mt-6 space-y-4">
          {([["name", "Your name", "text"], ["email", "Email address", "email"], ["whatsapp", "WhatsApp number", "tel"]] as const).map(([key, label, type]) => <label key={key} htmlFor={`info-${key}`} className="block mobile-info-field">
            <span className="text-sm text-muted-foreground">{label}</span>
            <input id={`info-${key}`} type={type} required autoComplete={key === "whatsapp" ? "tel" : key} maxLength={key === "email" ? 255 : 100} disabled={busy || !ready} value={s.info[key]} onChange={e => setInfo(key, e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); void next(); } }} placeholder={key === "whatsapp" ? "+234 800 000 0000" : undefined} className="field mt-1" onBlur={e => {
              const value = e.currentTarget.value.trim();
              const valid = key === "name" ? !!value : key === "email" ? /^\S+@\S+\.\S+$/.test(value) : value.replace(/\D/g, "").length >= 7;
              if (!valid) window.__lovableEvents?.track?.("project.xray_validation_error", { stage: "contact", field: key, reason: value ? "invalid_format" : "required" });
            }} />
          </label>)}
        </div> : <div className="xray-topic-fields mt-8">
          {current && <div key={current.id} className="animate-in fade-in slide-in-from-right-4 duration-300 motion-reduce:animate-none">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary tabular-nums">Question {QUESTIONS.findIndex(q => q.id === current.id) + 1} of {QUESTIONS.length}</p>
            <XrayTopicQuestion question={current} answer={s.answers[current.id] ?? ""} busy={busy || !ready} onAnswer={value => {
              setS(cur => ({ ...cur, answers: { ...cur.answers, [current.id]: value } }));
              const single = current.type === "scale" || (current.type === "choice" && !current.multi);
              window.clearTimeout(advanceTimer.current);
              if (single && value) advanceTimer.current = window.setTimeout(() => { if (qIndex < questions.length - 1) setQi(qIndex + 1); else if (!isLast) continueBtn.current?.click(); }, 350);
            }} />
          </div>}
        </div>}
      </div>
    <div className="assessment-actions mt-4 border-t border-border bg-background/95">
      <div className="mx-auto max-w-3xl px-5 pb-3 pt-3">
        {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
        <div className="flex items-center gap-3">
          <Button onClick={back} variant="outline" disabled={busy} className="h-12 shrink-0"><ArrowLeft className="h-4 w-4" /> Back</Button>
          <Button ref={continueBtn} variant="premium" onClick={() => void next()} disabled={!canContinue || busy || !ready} aria-busy={busy} className="xray-continue group h-12 min-w-0 flex-1 text-sm">{isLast && lastInPage ? "See my X-Ray" : lastInPage ? "Next stage" : "Next question"}<span className="xray-continue-arrow ml-2"><ArrowRight className="h-4 w-4" /></span></Button>
        </div>
      </div>
    </div>
    </div>
  </div>;
}
