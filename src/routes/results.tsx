import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import logo from "@/assets/logo-transparent.png";
import { loadState } from "@/lib/audit";
import { completeAudit } from "@/lib/audit-session.functions";
import { buildBookingUrl } from "@/lib/booking";
import { Button } from "@/components/ui/button";

import { Download, RefreshCw } from "lucide-react";
import {
  MEANING,
  costText,
  isDiagnosisResult,
  type DiagnosisResult as Result,
} from "@/lib/result-presentation";
import { buildDiagnosisReport } from "@/lib/diagnosis-report";
import { deliverFile } from "@/lib/download";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your Results — The Client X-Ray" },
      { name: "description", content: "Your client acquisition diagnosis from The Sales Doctor." },
      { property: "og:title", content: "Your Client X-Ray Results" },
      {
        property: "og:description",
        content: "See the biggest problem holding your client acquisition back.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Results,
});

const RESULT_KEY = "client-xray-diagnosis";

function Results() {
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const started = useRef(false);
  const [result, setResult] = useState<Result | null>(null);

  const run = useCallback(async () => {
    setStatus("loading");
    try {
      const s = loadState();
      if (!s.session) throw new Error("no session");
      const res = await completeAudit({ data: s.session });
      if (!res.ok) throw new Error("failed");
      try {
        localStorage.setItem(RESULT_KEY, JSON.stringify(res));
      } catch {}
      window.__lovableEvents?.track?.("project.xray_completed", {});
      setResult(res as Result);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      const saved = localStorage.getItem(RESULT_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isDiagnosisResult(parsed)) {
          setResult(parsed);
          setStatus("done");
          return;
        }
        localStorage.removeItem(RESULT_KEY);
      }
    } catch {
      /* A damaged cache must not prevent retrieval of the saved diagnosis. */
    }
    run();
  }, [run]);

  if (status === "done" && result) return <ResultView r={result} />;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="max-w-sm text-center">
        <img
          src={logo}
          alt="The Sales Doctor"
          className={`mx-auto w-36 ${status === "loading" ? "animate-pulse" : ""}`}
        />
        {status === "error" ? (
          <>
            <p role="alert" className="mt-10 text-foreground">
              We couldn't prepare your diagnosis right now. Your answers are safe. Please try again.
            </p>
            <Button variant="premium" onClick={run} className="mt-6 w-full">
              Try again
            </Button>
          </>
        ) : (
          <>
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p role="status" className="mt-6 font-display text-2xl text-primary">
              Your X-Ray is being prepared...
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function ResultView({ r }: { r: Result }) {
  const s = loadState();
  const serious = r.severity === "HIGH" || r.severity === "CRITICAL";
  const url = buildBookingUrl({
    name: s.info.name,
    email: s.info.email,
    business: s.answers["q1"] ?? "",
    diagnosis: r.diagnosis_title,
    severity: r.severity,
  });
  const label = "text-xs font-semibold uppercase text-muted-foreground";
  const section = "border-t border-border pt-8";
  return (
    <div className="results-workspace min-h-dvh bg-background px-6 pb-10 pt-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <img src={logo} alt="The Sales Doctor" className="mx-auto w-28" />
        <p className={`${label} text-center`}>Your client acquisition diagnosis</p>

        <div className="rounded-[2rem] bg-card px-5 py-10 text-center">
          <p className={label}>Your biggest problem</p>
          <h1 className="mt-3 break-words font-display text-4xl font-bold uppercase leading-tight text-primary">
            {r.diagnosis_title}
          </h1>
          <p className={`${label} mt-6`}>Severity</p>
          <span
            className={`mt-2 inline-block rounded-full px-5 py-1.5 text-sm font-semibold ${serious ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}
          >
            {r.severity}
          </span>
        </div>

        <ReportDownload r={r} />

        <section className={section}>
          <h2 className={label}>What's happening</h2>
          <p className="mt-3 text-xl font-medium text-foreground">{r.one_sentence_diagnosis}</p>
          <p className="mt-3 text-muted-foreground">{r.business_impact}</p>
        </section>

        <section className={section}>
          <h2 className={label}>Why we believe this</h2>
          <ul className="mt-3 space-y-3">
            {r.evidence.slice(0, 3).map((e) => (
              <li key={e} className="flex gap-3 text-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {e}
              </li>
            ))}
          </ul>
        </section>

        <section className={section}>
          <h2 className={label}>What this means</h2>
          <p className="mt-3 text-foreground">{MEANING[r.primary_diagnosis]}</p>
        </section>

        <section className={section}>
          <h2 className={label}>What this could be costing you</h2>
          <p className="mt-3 text-foreground">{costText(s.answers, r.primary_diagnosis)}</p>
        </section>

        {r.secondary_observation && (
          <section className={section}>
            <h2 className={label}>One more thing we noticed</h2>
            <p className="mt-3 text-foreground">{r.secondary_observation}</p>
          </section>
        )}

        <section className="mt-4 rounded-[2rem] bg-card p-6">
          <p className={label}>Your next move</p>
          <p className="mt-3 text-foreground">
            The diagnosis tells us where the problem is. It doesn’t tell us everything that needs to
            happen to fix it.
          </p>
          <p className="mt-3 text-foreground">
            That’s where the Client Acquisition Review comes in.
          </p>
          <h2 className="mt-6 font-display text-2xl font-semibold uppercase text-primary">
            Book your Client Acquisition Review
          </h2>
          <p className="mt-2 text-muted-foreground">
            I’ll look at your business, your numbers and your current acquisition process together
            and decide what needs to change first.
          </p>
          {url ? (
            <Button asChild variant="premium" className="mt-6 w-full">
              <Link to="/xray/book">BOOK WITH DR. DAN</Link>
            </Button>
          ) : (
            <Button variant="premium" disabled className="mt-6 w-full">
              BOOK WITH DR. DAN
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}

function ReportDownload({ r }: { r: Result }) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError(false);
    setBlob(null);
    const s = loadState();
    buildDiagnosisReport(r, s.info, s.answers)
      .then((file) => {
        if (active) setBlob(file);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [r, attempt]);
  return (
    <div>
      <Button
        variant="outline"
        className="w-full min-h-12"
        disabled={!blob && !error}
        onClick={() => {
          if (error) {
            setAttempt((n) => n + 1);
            return;
          }
          if (blob) {
            window.__lovableEvents?.track?.("project.xray_report_downloaded", {});
            void deliverFile(blob, "my-client-xray.pdf").catch(() => setError(true));
          }
        }}
      >
        {error ? <RefreshCw aria-hidden="true" /> : <Download aria-hidden="true" />}
        {error ? "Retry PDF report" : blob ? "Download my X-Ray report" : "Preparing PDF report…"}
      </Button>
      <p className="mt-2 text-center text-sm text-muted-foreground" role="status">
        {error
          ? "Your report couldn't be prepared. Please try again."
          : blob
            ? "Your PDF report is ready."
            : ""}
      </p>
    </div>
  );
}
