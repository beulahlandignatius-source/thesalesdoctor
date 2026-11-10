import { createFileRoute, Link } from "@tanstack/react-router";
import studio from "@/assets/diagnostic-studio.jpg";
import { ArrowUpRight, Activity, Stethoscope, ScanSearch, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="min-h-dvh bg-background">
      <section className="studio-hero relative isolate mx-3 mt-3 overflow-hidden rounded-[2rem] shadow-sm sm:mx-6 sm:rounded-[2.5rem]">
        <img
          src={studio}
          alt=""
          width={1536}
          height={1024}
          className="studio-image !rounded-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="studio-content mx-auto max-w-6xl px-6 pb-9 sm:px-10">
          <div className="max-w-lg">
            <p className="eyebrow flex items-center gap-2">
              <Activity className="h-4 w-4" /> The Sales Doctor
            </p>
            <h1 className="mt-4 font-display text-[40px] font-bold leading-tight text-studio-foreground sm:text-6xl">
              The Client <span className="whitespace-nowrap">X-Ray</span>
            </h1>
            <h2 className="mt-4 text-xl font-medium text-studio-foreground sm:text-2xl">
              Why Aren't You Getting More Clients?
            </h2>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-studio-muted">
              See exactly what's stopping you from getting consistent clients.
            </p>
            <Button asChild variant="premium" size="lg" className="mt-7 w-full sm:w-auto">
              <Link to="/audit">
                Get my X-Ray <ArrowUpRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-5 text-xs text-studio-muted">
              5–8 minutes · Free · Personalized diagnosis
            </p>
          </div>
        </div>
      </section>
      <section className="xray-introduction relative mx-auto max-w-6xl bg-background px-6 py-16 text-foreground sm:px-10 sm:py-24">
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
      </section>
    </div>
  );
}

function Pulse() {
  return <svg viewBox="0 0 600 80" fill="none" aria-hidden="true" className="h-8 w-28 opacity-70" preserveAspectRatio="none"><path className="ecg" d="M0 60 H150 L170 60 L185 20 L200 72 L215 44 L230 60 H330 L345 54 L360 30 L380 66 L395 50 C450 44 520 22 600 4" stroke="currentColor" strokeWidth="2.5" /></svg>;
}
