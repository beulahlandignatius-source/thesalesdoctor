import { createFileRoute, Link } from "@tanstack/react-router";
import studio from "@/assets/diagnostic-studio.jpg";
import { ArrowUpRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/xray/")({
  head: () => ({
    meta: [
      { title: "The Client X-Ray — Sales Doctor Client Acquisition Audit" },
      {
        name: "description",
        content:
          "A free 5-minute assessment that identifies the biggest problem stopping you from getting consistent clients.",
      },
      { property: "og:title", content: "The Client X-Ray — Why Aren't You Getting More Clients?" },
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
      <section className="xray-introduction mx-auto my-3 grid max-w-6xl gap-7 px-6 py-12 sm:my-8 sm:grid-cols-2 sm:gap-16 sm:px-10 sm:py-16">
        <div>
          <div className="mb-5 h-1.5 w-10 rounded-full bg-primary" />
          <h2 className="max-w-md font-display text-3xl font-semibold leading-snug text-foreground">
            This isn't a generic marketing quiz.
          </h2>
          <p className="mt-5 text-sm text-muted-foreground">
            Built by Dr. Dan Odotukpono, The Sales Doctor.
          </p>
        </div>
        <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            A free 5-minute assessment that examines how you attract, convert and follow up with
            potential clients, then identifies the biggest problem holding you back.
          </p>
          <p>
            Your answers are analyzed to identify the biggest weakness in your client acquisition
            process.
          </p>
        </div>
      </section>
    </div>
  );
}
