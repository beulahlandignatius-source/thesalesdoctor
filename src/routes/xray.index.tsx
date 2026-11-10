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
      <section className="xray-introduction relative mx-3 my-3 overflow-hidden rounded-[2rem] bg-ink px-6 py-14 text-ink-foreground sm:mx-6 sm:my-6 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <svg aria-hidden="true" viewBox="0 0 600 60" className="pointer-events-none absolute inset-x-0 bottom-6 h-12 w-full text-primary/40" fill="none" stroke="currentColor" strokeWidth="2"><path d="M0 30h200l15-22 20 44 18-36 12 14h335" /></svg>
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Activity className="h-3.5 w-3.5" /> Diagnosis</p>
            <h2 className="mt-6 max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              This isn't a generic <span className="text-primary">marketing quiz.</span>
            </h2>
            <p className="mt-6 inline-flex items-center gap-3 text-sm text-ink-foreground/70">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Stethoscope className="h-4 w-4" /></span>
              Built by Dr. Dan Odotukpono, The Sales Doctor.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl rounded-tr-md bg-ink-foreground/[0.06] p-6 ring-1 ring-ink-foreground/10 transition hover:-translate-y-1 hover:ring-primary/50">
              <ScanSearch className="h-6 w-6 text-primary" />
              <p className="mt-4 text-base leading-relaxed text-ink-foreground/85">
                A free 5-minute assessment that examines how you attract, convert and follow up with
                potential clients, then identifies the biggest problem holding you back.
              </p>
            </div>
            <div className="rounded-3xl rounded-bl-md bg-primary p-6 text-primary-foreground transition hover:-translate-y-1">
              <Target className="h-6 w-6" />
              <p className="mt-4 text-base font-semibold leading-relaxed">
                Your answers are analyzed to identify the biggest weakness in your client acquisition
                process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
