import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  startAuditSession,
  updateAuditInfo,
  saveAuditAnswer,
  getAuditSession,
} from "@/lib/audit-session.functions";
import {
  QUESTIONS,
  OPTIONAL_IDS,
  MULTI_SEP,
  loadState,
  saveState,
  emptyState,
  type AuditState,
  type BasicInfo,
} from "@/lib/audit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { DiagnosticGuide, DiagnosticSweep } from "@/components/diagnostic-guide";
import { answerMascotMood } from "@/lib/mascot-state";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Your Assessment | The Client X-Ray" },
      {
        name: "description",
        content:
          "Answer a few questions about your business to get your client acquisition diagnosis.",
      },
      { property: "og:title", content: "Take The Client X-Ray Assessment" },
      { property: "og:description", content: "One question at a time. Free and personalized." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Audit,
});

const TOTAL = QUESTIONS.length + 1;

function Audit() {
  const nav = useNavigate();
  const [s, setS] = useState<AuditState>(emptyState());
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [optionPage, setOptionPage] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );
  useEffect(() => {
    const local = loadState();
    setS(local);
    if (!local.session) {
      setReady(true);
      return;
    }
    getAuditSession({ data: local.session })
      .then((r) => {
        if (r.completed) {
          setS(emptyState());
          return;
        } // finished audits stay on /results; start fresh here
        setS((cur) => ({
          ...cur,
          info: r.info,
          answers: { ...cur.answers, ...r.answers },
          step: Math.max(cur.step, r.step),
        }));
      })
      .catch(() => setS((cur) => ({ ...emptyState(), info: cur.info })))
      .finally(() => setReady(true));
  }, [nav]);
  useEffect(() => {
    if (ready) saveState(s);
  }, [s, ready]);

  const step = Math.min(s.step, QUESTIONS.length);
  const q = step > 0 ? QUESTIONS[step - 1] : null;
  useEffect(() => {
    setOptionPage(0);
    if (ready) heading.current?.focus({ preventScroll: true });
  }, [step, ready]);
  const i = s.info;
  const infoValid =
    i.name.trim() &&
    /^\S+@\S+\.\S+$/.test(i.email.trim()) &&
    i.whatsapp.replace(/\D/g, "").length >= 7;
  const answer = q ? (s.answers[q.id] ?? "") : "";
  const canContinue = q ? answer.trim().length > 0 || OPTIONAL_IDS.has(q.id) : !!infoValid;
  const isLast = step >= QUESTIONS.length;

  const persist = (qid: string, value: string, nextStep: number, ref = s.session) =>
    ref
      ? saveAuditAnswer({ data: { ...ref, questionId: qid, answer: value, step: nextStep } }).catch(
          () => {},
        )
      : Promise.resolve();

  const next = async () => {
    if (!canContinue || busy || !ready) return;
    setError("");
    if (!q) {
      setBusy(true);
      try {
        const info = { name: i.name.trim(), email: i.email.trim(), whatsapp: i.whatsapp.trim() };
        let session = s.session;
        if (session) await updateAuditInfo({ data: { ...session, info } });
        else { session = await startAuditSession({ data: { info } }); window.__lovableEvents?.track?.("project.xray_started", {}); }
        setS({ ...s, session, step: 1 });
        window.scrollTo(0, 0);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (isLast) {
      // Re-sync every answer so a dropped connection mid-assessment can't lose anything.
      setBusy(true);
      try {
        const ref = s.session;
        if (!ref) throw new Error("Missing assessment session");
        await Promise.all(
          QUESTIONS.filter((x) => s.answers[x.id] != null).map((x) =>
            saveAuditAnswer({
              data: { ...ref, questionId: x.id, answer: s.answers[x.id] ?? "", step },
            }),
          ),
        );
      } catch {
        setBusy(false);
        setError("We couldn't save your answers. Please check your connection and try again.");
        return;
      }
    } else persist(q.id, answer, step + 1);
    if (isLast) {
      try {
        localStorage.removeItem("client-xray-diagnosis");
      } catch {}
      nav({ to: "/results" });
      return;
    }
    setS({ ...s, step: step + 1 });
    window.scrollTo(0, 0);
  };
  const back = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setError("");
    if (step === 0) nav({ to: "/xray" });
    else {
      setS({ ...s, step: step - 1 });
      window.scrollTo(0, 0);
    }
  };
  const setInfo = (k: keyof BasicInfo, v: string) => setS({ ...s, info: { ...s.info, [k]: v } });
  const setAnswer = (v: string) => q && setS({ ...s, answers: { ...s.answers, [q.id]: v } });
  const multi = q?.type === "choice" && !!q.multi;
  const selected = multi ? answer.split(MULTI_SEP).filter(Boolean) : [answer];
  const pick = (v: string) => {
    if (!q) return;
    try { navigator.vibrate?.(8); } catch {}
    if (multi) {
      const set = selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v];
      setAnswer(set.join(MULTI_SEP));
      return;
    }
    const ns = { ...s, answers: { ...s.answers, [q.id]: v } };
    setS(ns);
    persist(q.id, v, isLast ? step : step + 1);
    if (!isLast) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        setS((cur) => (cur.step === step ? { ...cur, step: step + 1 } : cur));
        window.scrollTo(0, 0);
      }, 220);
    }
  };

  const keyRef = useRef<(e: KeyboardEvent) => void>(() => {});
  keyRef.current = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT")) {
      if (e.key === "Enter" && t.tagName === "INPUT") { e.preventDefault(); next(); }
      return;
    }
    if (e.key === "Enter") { e.preventDefault(); next(); return; }
    if (q && q.type !== "text") {
      const n = e.key.toUpperCase().charCodeAt(0) - 65;
      const option = q.options[n];
      if (e.key.length === 1 && option !== undefined) pick(option);
    }
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const pct = Math.round(((step + 1) / TOTAL) * 100);
  const cheer =
    pct >= 90 ? "Almost there. Your X-Ray is nearly ready"
    : pct >= 75 ? "Final stretch. The picture is getting clear"
    : pct >= 50 ? "Over halfway. Keep going"
    : pct >= 25 ? "Great momentum. Your diagnosis is taking shape"
    : step >= 1 ? "Nice start. Every answer sharpens your X-Ray"
    : null;
  const remaining = Math.max(0, TOTAL - step - 1);

  return (
    <div className={`min-h-dvh bg-background xray-ambient mobile-assessment ${step === 0 ? "assessment-contact-screen" : ""}`}>
      <DiagnosticSweep repeat />
      <div className="assessment-workspace mx-auto flex min-h-dvh max-w-xl flex-col px-6 pb-32 pt-5 sm:pt-8">
        <header className="xray-bar flex items-center justify-between pr-14">
          <Button
            onClick={back}
            variant="ghost"
            size="sm"
            disabled={busy}
            className="-ml-3 min-h-11 text-muted-foreground"
          >
            <ArrowLeft /> Back
          </Button>
          <Link to="/xray" className="font-display text-base font-medium text-primary">
            Client X-Ray
          </Link>
          <span className="text-xs font-semibold tabular-nums text-muted-foreground">
            {step + 1}/{TOTAL}
          </span>
        </header>
        <div
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuemin={1}
          aria-valuemax={TOTAL}
          aria-valuenow={step + 1}
          aria-valuetext={`Step ${step + 1} of ${TOTAL}`}
          className="mt-5 h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="xray-progress h-full rounded-full bg-primary transition-all duration-700 ease-out"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-primary"><span className="xray-pulse-dot" />{pct}% scanned</span>
          <span className="text-muted-foreground">{remaining === 0 ? "Last one" : `${remaining} to go`}</span>
        </div>

        <div key={`guide-${step}`} className="assessment-guide mt-6">
          <DiagnosticGuide compact mood={busy ? "examining" : answerMascotMood(q ?? null, answer)} scanning={busy || step === 0 || !!q}
            message={step === 0 ? "Let's take an X-ray of your business!" : "Let's see what's happening inside your business."} />
        </div>
        <div
          key={step}
          className="assessment-question mt-10 flex-1 animate-in fade-in slide-in-from-right-4 duration-300 sm:mt-16"
        >
          {!q ? (
            <>
              <p className="eyebrow">Before we begin</p>
              <h1
                id="question-heading"
                ref={heading}
                tabIndex={-1}
                className="xray-question mt-3 font-display text-foreground"
              >
                Tell us about you
              </h1>
              <div className="mt-6 space-y-4">
                {(
                  [
                    ["name", "Your name", "text"],
                    ["email", "Email address", "email"],
                    ["whatsapp", "WhatsApp number", "tel"],
                  ] as const
                ).map(([k, label, type]) => (
                  <label key={k} htmlFor={`info-${k}`} className="block mobile-info-field">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <input
                      id={`info-${k}`}
                      required
                      autoComplete={k === "whatsapp" ? "tel" : k}
                      type={type}
                      maxLength={k === "email" ? 255 : 100}
                      value={i[k]}
                      onChange={(e) => setInfo(k, e.target.value)}
                      placeholder={k === "whatsapp" ? "+234 800 000 0000" : undefined}
                      className="field mt-1"
                    />
                  </label>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{q.section}</span>
              </div>
              {cheer && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary animate-in fade-in duration-500">
                  {cheer}
                </p>
              )}
              <h1
                id="question-heading"
                ref={heading}
                tabIndex={-1}
                className="xray-question mt-4 font-display text-foreground"
              >
                <span aria-hidden="true" className="xray-qnum">{String(step).padStart(2, "0")}</span>
                <span className="sr-only">Question {step} of {QUESTIONS.length}. </span>
                {q.text}
              </h1>
              {multi && (
                <p className="mt-2 text-sm text-muted-foreground">Select all that apply.</p>
              )}
              {OPTIONAL_IDS.has(q.id) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Optional. Skip if you'd rather not say.
                </p>
              )}
              {q.type === "text" ? (
                <>
                <textarea
                  aria-labelledby="question-heading"
                  required={!OPTIONAL_IDS.has(q.id)}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder={q.placeholder ?? "Type your answer"}
                  className="field mt-6 resize-none"
                />
                <p className="mt-2 text-right text-xs tabular-nums text-muted-foreground">{answer.length}/1000</p>
                </>
              ) : (
                <div role="group" aria-labelledby="question-heading" className="assessment-options mt-6 space-y-3">
                  {q.options.map((o, oi) => {
                    const on = selected.includes(o);
                    return (
                      <Button
                        variant="answer"
                        key={o}
                        disabled={!ready || busy}
                        onClick={() => pick(o)}
                        aria-pressed={on}
                        className={`xray-option animate-in fade-in slide-in-from-bottom-2 fill-mode-both ${Math.floor(oi / 3) === optionPage ? "option-visible" : "option-offscreen"} ${on ? "answer-card-on" : ""}`}
                        style={{ animationDelay: `${oi * 45}ms` }}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold transition-all duration-200 ${multi ? "rounded-lg" : "rounded-full"} border-2 ${on ? "scale-110 border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}
                        >
                          {on ? <Check className="h-4 w-4 animate-in zoom-in duration-200" /> : String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1 text-left text-base font-medium leading-snug">{o}</span>
                        <ArrowRight aria-hidden="true" className="xray-option-arrow h-4 w-4 shrink-0 text-primary" />
                      </Button>
                    );
                  })}
                </div>
              )}
              {q.type !== "text" && q.options.length > 3 && <nav className="mobile-option-controls" aria-label="Answer choices">
                <Button variant="ghost" size="sm" disabled={optionPage === 0} onClick={() => setOptionPage(optionPage - 1)} aria-label="Previous choices"><ArrowLeft /></Button>
                <span>{optionPage * 3 + 1}–{Math.min((optionPage + 1) * 3, q.options.length)} of {q.options.length}{multi && selected.length > 0 ? ` · ${selected.length} selected` : ""}</span>
                <Button variant="ghost" size="sm" disabled={(optionPage + 1) * 3 >= q.options.length} onClick={() => setOptionPage(optionPage + 1)} aria-label="More choices"><ArrowRight /></Button>
              </nav>}
              {q.type !== "text" && (
                <p className="mt-6 hidden text-xs text-muted-foreground sm:block">
                  Tip: press <kbd className="rounded border border-border bg-card px-1.5">A</kbd>–<kbd className="rounded border border-border bg-card px-1.5">{String.fromCharCode(64 + q.options.length)}</kbd> to choose, <kbd className="rounded border border-border bg-card px-1.5">Enter</kbd> to continue.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Thumb-reach action bar: always visible at the bottom of the screen */}
      <div
        className="assessment-actions fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-xl px-5 pt-3">
          {error && (
            <p role="alert" className="mb-3 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            variant="premium"
            onClick={next}
            disabled={!canContinue || busy || !ready}
            className="xray-continue group h-14 w-full text-base"
          >
            {busy
              ? "Saving…"
              : isLast
                ? "See my X-Ray"
                : q && OPTIONAL_IDS.has(q.id) && !answer
                  ? "Skip"
                  : "Continue"}
            {!busy && <span className="xray-continue-arrow ml-3"><ArrowRight className="h-4 w-4" /></span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
