import { createFileRoute, Link } from "@tanstack/react-router";
import { CtaLink } from "@/components/site";
import { CLINIC_PRICE } from "@/lib/links";

export const Route = createFileRoute("/book/")({
  head: () => ({
    meta: [
      { title: "Choose your session — The Sales Clinic" },
      { name: "description", content: "Free 25-min Client Acquisition Review or a 90-min Private Sales Clinic with Dr. Dan." },
      { property: "og:title", content: "Choose your session — The Sales Clinic" },
      { property: "og:description", content: "Both start with your goals. The difference is how deep we go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

function Tick({ children }: { children: string }) {
  return <li className="flex gap-3"><span className="mt-1 text-primary">✓</span><span>{children}</span></li>;
}

function Book() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">← Back to The Sales Clinic</Link>
      <h1 className="mt-6 text-4xl font-black md:text-6xl">Choose your session.</h1>
      <p className="mt-3 text-lg text-muted-foreground">Both start with your goals. The difference is how deep we go.</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="flex flex-col rounded-2xl border border-border bg-card p-7">
          <p className="eyebrow">Free · 25 min</p>
          <h2 className="mt-3 text-3xl font-extrabold">Client Acquisition Review</h2>
          <p className="mt-2 text-muted-foreground">Best if you want clarity on what’s holding you back.</p>
          <p className="eyebrow mt-6 text-muted-foreground">You’ll leave knowing</p>
          <ul className="mt-3 flex-1 space-y-2">
            <Tick>What’s working and what isn’t</Tick>
            <Tick>The biggest thing holding your client acquisition back</Tick>
            <Tick>Your #1 opportunity to improve</Tick>
          </ul>
          <CtaLink to="/book/free" variant="outline" className="mt-8 w-full">BOOK MY FREE REVIEW →</CtaLink>
        </article>

        <article className="relative flex flex-col rounded-2xl bg-ink p-7 text-ink-foreground shadow-2xl">
          <p className="eyebrow">Most impact · 90 min</p>
          <p className="mt-3 font-display text-5xl font-black">{CLINIC_PRICE}</p>
          <h2 className="mt-1 text-3xl font-extrabold">Private Sales Clinic</h2>
          <p className="mt-2 text-ink-foreground/70">Best if you’re ready to work on it, not just talk about it.</p>
          <p className="eyebrow mt-6 text-ink-foreground/60">We’ll work through</p>
          <ul className="mt-3 flex-1 space-y-2">
            <Tick>Your numbers: leads, conversion and revenue</Tick>
            <Tick>Your acquisition process, step by step</Tick>
            <Tick>Exactly what has to change to hit your target</Tick>
            <Tick>A prioritised action plan you leave with</Tick>
          </ul>
          <CtaLink to="/book/clinic" className="mt-8 w-full">BOOK MY SALES CLINIC →</CtaLink>
        </article>
      </div>

      <dl className="mt-8 grid gap-4 rounded-xl bg-blush p-6 md:grid-cols-3">
        {[["Depth", "Review vs. working session"], ["Focus", "Find the gap vs. close it"], ["Not sure?", "Start free. Go deeper after."]].map(([k, v]) => (
          <div key={k}><dt className="font-display font-bold">{k}</dt><dd className="text-muted-foreground">{v}</dd></div>
        ))}
      </dl>
    </main>
  );
}
