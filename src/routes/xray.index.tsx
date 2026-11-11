import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Stethoscope, ScanSearch, ScanLine, ChartNoAxesCombined, Target, Clock3, Check, Pause, Play, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiagnosticGuide } from "@/components/diagnostic-guide";
import { useEffect, useState } from "react";
import portrait from "@/assets/dr-dan-portrait.jpg.asset.json";
import { loadState } from "@/lib/audit";
import { XrayRestart } from "@/components/xray-restart";

export const Route = createFileRoute("/xray/")({
  head: () => ({
    meta: [
      { title: "The Client X-Ray | Sales Doctor Client Acquisition Audit" },
      {
        name: "description",
        content:
          "A free 5-minute assessment that identifies the biggest problem stopping you from getting consistent clients.",
      },
      { property: "og:title", content: "The Client X-Ray | Why Aren't You Getting More Clients?" },
      {
        property: "og:description",
        content: "Free personalized diagnosis by Dr. Dan Odotukpono, The Sales Doctor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [scanPaused, setScanPaused] = useState(false);
  useEffect(() => { setHasSession(!!loadState().session); }, []);
  return (
    <div className={`xray-opening xray-photo-opening bg-background ${detailsOpen ? "xray-details-open" : ""}`}>
      <section className={`xray-photo-hero relative isolate overflow-hidden ${scanPaused ? "hero-scan-paused" : ""}`}>
        <img src={portrait.url} alt="Dr. Dan Odotukpono, The Sales Doctor, with his stethoscope" className="xray-photo-subject" fetchPriority="high" />
        <div className="xray-hero-scan" aria-hidden="true">
          <div className="xray-hero-scan-view">
            <img src={portrait.url} alt="" className="xray-scan-photo" />
            <div className="xray-scan-grid" />
            <div className="xray-scan-organs"><span><Users /></span><span><Target /></span><span><ChartNoAxesCombined /></span></div>
          </div>
          <div className="xray-hero-scan-beam" />
        </div>
        <div className="xray-photo-shade" aria-hidden="true" />
        <Button variant="outline" size="icon" className="xray-hero-scan-control min-h-11 min-w-11" aria-label={scanPaused ? "Play hero scanning animation" : "Pause hero scanning animation"} aria-pressed={scanPaused} onClick={() => setScanPaused(!scanPaused)}>{scanPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}</Button>
        <div className="xray-photo-instrument" aria-hidden="true"><ScanLine /><ChartNoAxesCombined /><div className="xray-photo-beam" /></div>
        <div className="xray-photo-copy mx-auto max-w-6xl px-6 sm:px-10">
          <div className="max-w-lg">
            <p className="eyebrow flex items-center gap-2">
              <Activity className="h-4 w-4" /> The Sales Doctor
            </p>
            <h1 className="mt-3 font-display text-[40px] font-bold leading-tight sm:mt-4 sm:text-6xl">
              The Client <span className="whitespace-nowrap">X-Ray</span>
            </h1>
            <h2 className="mt-3 text-xl font-medium sm:mt-4 sm:text-2xl">
              Why Aren't You Getting More Clients?
            </h2>
            <p className="xray-photo-description mt-3 max-w-sm text-base leading-relaxed">
              See exactly what's stopping you from getting consistent clients.
            </p>
            <Button asChild variant="premium" size="lg" className="mt-5 w-full sm:mt-7 sm:w-auto">
              <Link to="/audit">
                Get my X-Ray <ArrowUpRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <div className="xray-photo-meta mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:mt-5"><span><Clock3 />5–8 minutes</span><span><Check />Free</span><span><ScanSearch />Personalized diagnosis</span></div>
          </div>
        </div>
      </section>
      <div className="xray-welcome mx-auto max-w-6xl px-6 py-6 sm:px-10">
        <DiagnosticGuide message="Let's scan. Let's take an X-ray of your business!" scanning />
        {hasSession && <div className="mt-4 max-w-lg"><XrayRestart /></div>}
      </div>
      <section className="xray-introduction relative mx-auto max-w-6xl bg-background px-6 py-16 text-foreground sm:px-10 sm:py-24">
        <Button variant="ghost" className="xray-details-toggle" aria-expanded={detailsOpen} aria-controls="xray-intro-details" onClick={() => setDetailsOpen(!detailsOpen)}>
          <span className="xray-details-label">This isn't a generic marketing quiz.<span className="xray-details-hint">{detailsOpen ? "Tap to see less" : "Tap to see more"}</span></span>
          <span className="xray-details-symbol" aria-hidden="true">{detailsOpen ? "−" : "+"}</span>
        </Button>
        <div id="xray-intro-details" className="xray-intro-details">
        <p className="eyebrow flex items-center gap-2"><Activity className="h-4 w-4" /> Diagnosis</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,4.25rem)] font-black leading-[0.95] tracking-tight">
          This isn't a generic <span className="text-primary">marketing quiz.</span>
        </h2>
        <div className="proof-bento xray-bento mt-12">
          <article className="proof-tile proof-tile-1">
            <div className="flex items-center justify-between"><span className="proof-icon"><ScanSearch aria-hidden="true" className="h-6 w-6" /></span><Pulse /></div>
            <p className="mt-10 font-display text-2xl font-bold leading-snug sm:text-3xl">A free 5-minute assessment that examines how you attract, convert and follow up with potential clients, then identifies the biggest problem holding you back.</p>
          </article>
          <article className="proof-tile proof-tile-2">
            <div className="flex items-center justify-between"><span className="proof-icon"><Target aria-hidden="true" className="h-6 w-6" /></span><Pulse /></div>
            <p className="proof-label !max-w-none font-semibold">Your answers are analyzed to identify the biggest weakness in your client acquisition process.</p>
          </article>
          <article className="proof-tile proof-tile-3">
            <div className="flex items-center justify-between"><span className="proof-icon"><Stethoscope aria-hidden="true" className="h-6 w-6" /></span><Pulse /></div>
            <p className="proof-label !max-w-none font-semibold">Built by Dr. Dan Odotukpono, The Sales Doctor.</p>
          </article>
        </div>
        </div>
      </section>
    </div>
  );
}

function Pulse() {
  return <svg viewBox="0 0 600 80" fill="none" aria-hidden="true" className="h-8 w-28 opacity-70" preserveAspectRatio="none"><path className="ecg" d="M0 60 H150 L170 60 L185 20 L200 72 L215 44 L230 60 H330 L345 54 L360 30 L380 66 L395 50 C450 44 520 22 600 4" stroke="currentColor" strokeWidth="2.5" /></svg>;
}
