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
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Your Assessment — The Client X-Ray" },
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
        else session = await startAuditSession({ data: { info } });
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

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-6 pb-32 pt-5 sm:pt-8">
        <header className="flex items-center justify-between pr-14">
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
          className="mt-5 h-1 w-full overflow-hidden rounded-full bg-muted"
        >
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
          />
        </div>

        <div
          key={step}
          className="mt-10 flex-1 animate-in fade-in slide-in-from-right-4 duration-300 sm:mt-16"
        >
          {!q ? (
            <>
              <p className="eyebrow">Before we begin</p>
              <h1
                id="question-heading"
                ref={heading}
                tabIndex={-1}
                className="mt-3 font-display text-3xl font-bold text-foreground"
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
                  <label key={k} htmlFor={`info-${k}`} className="block">
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
              <p className="eyebrow">
                Question {step} of {QUESTIONS.length} · {q.section}
              </p>
              <h1
                id="question-heading"
                ref={heading}
                tabIndex={-1}
                className="mt-4 font-display text-2xl font-semibold leading-snug text-foreground"
              >
                {q.text}
              </h1>
              {multi && (
                <p className="mt-2 text-sm text-muted-foreground">Select all that apply.</p>
              )}
              {OPTIONAL_IDS.has(q.id) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Optional — skip if you'd rather not say.
                </p>
              )}
              {q.type === "text" ? (
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
              ) : (
                <div role="group" aria-labelledby="question-heading" className="mt-6 space-y-3">
                  {q.options.map((o) => {
                    const on = selected.includes(o);
                    return (
                      <Button
                        variant="answer"
                        key={o}
                        disabled={!ready || busy}
                        onClick={() => pick(o)}
                        aria-pressed={on}
                        className={on ? "answer-card-on" : ""}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-5 w-5 shrink-0 ${multi ? "rounded-md" : "rounded-full"} border-2 ${on ? "border-primary bg-primary" : "border-secondary"}`}
                        />
                        <span>{o}</span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Thumb-reach action bar: always visible at the bottom of the screen */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 backdrop-blur"
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
            className="w-full"
          >
            {busy
              ? "Saving…"
              : isLast
                ? "See my X-Ray"
                : q && OPTIONAL_IDS.has(q.id) && !answer
                  ? "Skip"
                  : "Continue"}
            {!busy && <ArrowRight className="ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
