import redSuit from "@/assets/dr-dan-red-suit.jpg";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { CtaLink } from "@/components/site";
import { CLINIC_PRICE } from "@/lib/links";
import { Check, Compass, Layers, Search, Stethoscope, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/book/")({
  head: () => ({
    meta: [
      { title: "Choose your session | The Sales Clinic" },
      { name: "description", content: "Free 25-min Client Acquisition Review or a 90-min Private Sales Clinic with Dr. Dan." },
      { property: "og:title", content: "Choose your session | The Sales Clinic" },
      { property: "og:description", content: "Both start with your goals. The difference is how deep we go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

function Tick({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${dark ? "bg-primary text-primary-foreground" : "bg-blush text-primary"}`}>
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function Book() {
  return (
    <main className="relative mx-auto max-w-6xl overflow-hidden px-5 py-10 md:py-16">
      <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-blush opacity-70 blur-3xl" />
      <Link to="/" className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary">← Back to The Sales Clinic</Link>

      <header className="relative mt-8 grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blush px-3 py-1 text-xs font-semibold text-primary"><Stethoscope className="h-3.5 w-3.5" /> The Sales Clinic</span>
          <h1 className="mt-4 text-5xl font-black leading-[0.95] md:text-7xl">Choose your <span className="text-primary">session.</span></h1>
        </div>
        <div className="flex items-end gap-4 md:flex-col md:items-stretch">
          <figure className="session-portrait"><img src={redSuit} alt="Dr. Dan Odotukpono in a red suit, seated and smiling" className="h-full w-full object-cover object-top" /></figure>
          <p className="text-lg text-muted-foreground md:pb-2">Both start with your goals. The difference is how deep we go.</p>
        </div>
      </header>

      <SessionCarousel>
        <article className="group flex flex-col border border-border bg-card p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-9" style={{ borderRadius: "2rem .75rem 2rem 2rem" }}>
          <div className="flex items-center justify-between">
            <p className="eyebrow">Free · 25 min</p>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-primary transition group-hover:rotate-6"><Search className="h-5 w-5" /></span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">Client Acquisition Review</h2>
          <p className="mt-2 text-muted-foreground">Best if you want clarity on what’s holding you back.</p>
          <div className="my-6 h-px bg-border" />
          <p className="eyebrow text-muted-foreground">You’ll leave knowing</p>
          <ul className="mt-4 flex-1 space-y-3">
            <Tick>What’s working and what isn’t</Tick>
            <Tick>The biggest thing holding your client acquisition back</Tick>
            <Tick>Your #1 opportunity to improve</Tick>
          </ul>
          <CtaLink to="/book/free" variant="outline" className="mt-8 w-full">BOOK MY FREE REVIEW →</CtaLink>
        </article>

        <article className="group relative flex flex-col overflow-hidden bg-ink p-7 text-ink-foreground shadow-2xl transition duration-300 hover:-translate-y-1 md:p-9" style={{ borderRadius: ".75rem 2rem 2rem 2rem" }}>
          <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary opacity-30 blur-3xl" />
          <svg aria-hidden viewBox="0 0 400 60" className="pointer-events-none absolute inset-x-0 top-28 w-full text-primary opacity-40"><path d="M0 40 H120 L135 15 L150 52 L165 30 L180 40 H260 L400 8" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          <div className="relative flex items-center justify-between">
            <p className="eyebrow">Most impact · 90 min</p>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground transition group-hover:-rotate-6"><TrendingUp className="h-5 w-5" /></span>
          </div>
          <p className="relative mt-6 font-display text-6xl font-black md:text-7xl">{CLINIC_PRICE}</p>
          <h2 className="relative mt-2 text-3xl font-extrabold md:text-4xl">Private Sales Clinic</h2>
          <p className="relative mt-2 text-ink-foreground/70">Best if you’re ready to work on it, not just talk about it.</p>
          <div className="relative my-6 h-px bg-ink-foreground/15" />
          <p className="eyebrow relative text-ink-foreground/60">We’ll work through</p>
          <ul className="relative mt-4 flex-1 space-y-3">
            <Tick dark>Your numbers: leads, conversion and revenue</Tick>
            <Tick dark>Your acquisition process, step by step</Tick>
            <Tick dark>Exactly what has to change to hit your target</Tick>
            <Tick dark>A prioritised action plan you leave with</Tick>
          </ul>
          <CtaLink to="/book/clinic" className="relative mt-8 w-full">BOOK MY SALES CLINIC →</CtaLink>
        </article>
      </SessionCarousel>

      <dl className="relative mt-8 grid gap-3 md:grid-cols-3">
        {([["Depth", "Review vs. working session", Layers], ["Focus", "Find the gap vs. close it", Target], ["Not sure?", "Start free. Go deeper after.", Compass]] as const).map(([k, v, Icon], i) => (
          <div key={k} className={`flex items-start gap-4 p-5 transition hover:-translate-y-0.5 ${i === 2 ? "bg-primary text-primary-foreground" : "bg-blush"}`} style={{ borderRadius: "1.5rem .5rem 1.5rem 1.5rem" }}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${i === 2 ? "bg-primary-foreground/15" : "bg-card text-primary"}`}><Icon className="h-4 w-4" /></span>
            <div><dt className="font-display font-bold">{k}</dt><dd className={i === 2 ? "opacity-85" : "text-muted-foreground"}>{v}</dd></div>
          </div>
        ))}
      </dl>
    </main>
  );
}

/** Auto-advancing, swipeable carousel; pauses while hovered, touched or focused. */
function SessionCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = Children.count(children);
  const goTo = (i: number) => { const el = track.current; const card = el?.children[i] as HTMLElement | undefined; if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" }); };
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => goTo((active + 1) % count), 4500);
    return () => clearInterval(t);
  }, [active, paused, count]);
  return <div className="relative mt-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
    <div ref={track} aria-roledescription="carousel" className="session-track flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      onScroll={(e) => { const el = e.currentTarget; const w = (el.children[0] as HTMLElement)?.offsetWidth ?? 1; setActive(Math.round(el.scrollLeft / (w + 24))); }}>
      {Children.map(children, (c) => <div className="flex w-[88%] shrink-0 snap-start md:w-[62%] [&>article]:w-full">{c}</div>)}
    </div>
    <div className="mt-4 flex justify-center gap-2">{Array.from({ length: count }, (_, i) => <button key={i} type="button" aria-label={`Show session ${i + 1}`} aria-current={active === i} onClick={() => goTo(i)} className={`h-2.5 rounded-full transition-all ${active === i ? "w-8 bg-primary" : "w-2.5 bg-border"}`} />)}</div>
  </div>;
}
