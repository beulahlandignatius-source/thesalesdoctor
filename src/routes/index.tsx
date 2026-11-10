import { createFileRoute } from "@tanstack/react-router";
import { CtaLink } from "@/components/site";
import desk from "@/assets/dr-dan-desk.jpg";
import portrait from "@/assets/dr-dan-portrait.jpg.asset.json";
import standing from "@/assets/dr-dan-standing.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Sales Clinic — Dr. Dan, The Sales Doctor" },
      { name: "description", content: "What would it take to get you to your next revenue target? Book a free 25-min review or a 90-min Private Sales Clinic with Dr. Dan." },
      { property: "og:title", content: "The Sales Clinic — Dr. Dan, The Sales Doctor" },
      { property: "og:description", content: "Pinpoint exactly what has to change to hit your next revenue target." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: portrait.url },
      { name: "twitter:image", content: portrait.url },
    ],
  }),
  component: Index,
});

const stats = [
  ["$127K+", "closed for clients"],
  ["150+", "people mentored"],
  ["30+", "clients across countries"],
];

const questions = [
  ["01", "Where are you now?", "Your real numbers, offer and how clients find you today."],
  ["02", "Where do you want to go?", "Your next client or revenue target, made specific."],
  ["03", "What has to change?", "The gap between the two, and the moves that close it."],
];

const who = [
  ["“I need my first or next clients.”", "You’re good at what you do. Getting paid for it consistently is the problem."],
  ["“My pipeline is feast or famine.”", "Some months are great. Others are silent. You want a steady flow of qualified leads."],
  ["“I get leads, but they don’t convert.”", "Conversations happen. Yeses don’t. Something in your sales process or follow-up is leaking."],
  ["“I’m selling. Now I want to scale.”", "What got you here won’t get you to the next number. You want to grow on purpose."],
];

const steps = [
  ["Choose your session", "A free 25-minute review, or a 90-minute deep working session."],
  ["Tell me where you are", "A short form about your goals and challenges, so we don’t waste a minute."],
  ["Walk away with clarity", "You leave knowing what’s in the way and what to do next."],
];

const gives = [
  ["Me, in your corner.", "Direct guidance, not a course you’ll never finish."],
  ["Your real deals, not theory.", "We work on the outreach, calls and proposals in front of you."],
  ["A system built around your offer.", "One you can run again and again."],
  ["Confidence to close.", "Know what to say, when to follow up, and how to ask for the yes."],
];

const proof = [
  ["$127K+", "in sales closed for clients"],
  ["150+", "people mentored to land their first or next clients"],
  ["30+", "high-level clients across different countries"],
];

const testimonials = [
  ["“In one session Dr. Dan showed me exactly where my deals were leaking. I fixed my follow-up and closed two retainers the next month.”", "Adaeze N.", "Founder, brand studio"],
  ["“I’d never landed a paying client on my own. Three weeks into the mentorship I signed my first one, and I knew exactly how I did it.”", "Tobi A.", "Freelance designer, Nigeria"],
  ["“We rebuilt our outreach and offer together. That system brought in our biggest contract yet.”", "Michael O.", "Director, B2B consultancy"],
];

function Index() {
  return (
    <main className="clinic-home overflow-x-clip">
      {/* ===== HERO ===== */}
      <section className="clinic-hero relative overflow-hidden bg-background">
        <div className="hero-photo pointer-events-none absolute inset-y-0 right-0 hidden w-[55%] lg:block">
          <img src={portrait.url} alt="Dr. Dan Odotukpono, The Sales Doctor, smiling with a stethoscope" className="h-full w-full object-cover object-top" fetchPriority="high" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pt-10 md:px-10 md:pt-16 lg:pb-16 lg:pt-20">
          <div className="relative z-10 lg:max-w-[58%]">
            <p className="eyebrow">With Dr. Dan Odotukpono, The Sales Doctor</p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.04] sm:text-6xl md:text-7xl lg:text-[76px]">
              What would it take to get you to your{" "}
              <span className="text-primary">next revenue target?</span>
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Whether you’re chasing your first clients or trying to break past your best month yet, we’ll look at your goals, your numbers and how you win clients, and pinpoint exactly what has to change to get you there.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <CtaLink to="/book">BOOK A CONSULTATION</CtaLink>
              <p className="text-xs leading-relaxed text-muted-foreground">Free 25-min option available<br />Takes 2 minutes to book</p>
            </div>
          </div>
          <div className="relative mt-10 overflow-hidden lg:hidden">
            <img src={portrait.url} alt="Dr. Dan Odotukpono, The Sales Doctor, smiling with a stethoscope" className="hero-mobile-photo w-full object-cover object-top" fetchPriority="high" />
          </div>
          <p className="relative pb-7 pt-4 font-display text-xs font-semibold text-muted-foreground lg:absolute lg:bottom-8 lg:right-10 lg:pb-0">
            The Sales <span className="text-primary">Doctor</span>
          </p>
        </div>
        <dl className="relative mx-auto grid max-w-7xl grid-cols-3 border-y border-border bg-background px-3 md:px-10">
          {stats.map(([n, l], i) => (
            <div key={n} className={`px-3 py-7 md:px-8 md:py-9 ${i ? "border-l border-border" : ""}`}>
              <dt className="font-display text-3xl font-bold leading-none md:text-5xl">{n}</dt>
              <dd className="mt-3 text-xs text-muted-foreground md:text-sm">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ===== 3 QUESTIONS — the funnel ===== */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Your session</p>
            <h2 className="mt-4 text-4xl font-bold leading-[1.1] tracking-normal md:text-5xl">3 questions we answer</h2>
          </div>
          <ol className="md:col-span-8">
            {questions.map(([n, t, d]) => (
              <li key={n} className="funnel-row group grid grid-cols-[auto_1fr] items-baseline gap-5 border-t border-border py-7 md:gap-10" >
                <span className="font-display text-3xl font-bold leading-none text-primary/70 transition-colors group-hover:text-primary md:text-5xl">{n}</span>
                <div>
                  <h3 className="text-2xl font-semibold md:text-3xl">{t}</h3>
                  <p className="mt-2 max-w-md text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== WHO — dark editorial ===== */}
      <section className="relative bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
          <p className="eyebrow">Who this is for</p>
          <h2 className="mt-5 max-w-5xl text-4xl md:text-6xl font-bold leading-[1.1] tracking-normal">
            You don’t have to be stuck to need a better system. <span className="text-primary">You just need a bigger target.</span>
          </h2>
          <div className="mt-14 grid md:grid-cols-2">
            {who.map(([q, d], i) => (
              <div key={q} className={`symptom group border-t border-ink-foreground/20 py-8 md:px-8 ${i % 2 ? "md:border-l" : "md:pl-0"}`}>
                <p className="font-display text-xs font-bold tracking-[0.2em] text-primary">0{i + 1}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">{q}</h3>
                <p className="mt-3 max-w-md text-ink-foreground/65">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-ink-foreground/20 pt-10 sm:flex-row sm:items-center">
            <CtaLink to="/book">FIND MY NEXT STEP →</CtaLink>
            <p className="text-sm text-ink-foreground/65">Sound like you? Pick the session that fits.</p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — pipeline ===== */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-12">How it works</p>
          <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-normal md:col-span-9">
            From “not sure what’s wrong” to <span className="marker">“I know exactly what to do.”</span>
          </h2>
        </div>
        <ol className="clinic-steps relative mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {steps.map(([t, d], i) => (
            <li key={t} className="relative border-t border-border pl-14 pt-7 md:pl-0 md:pr-10 md:pt-20">
              <span className="node absolute left-0 top-7 flex h-8 w-8 items-center justify-center rounded-full bg-blush font-display text-sm font-bold text-primary">{i + 1}</span>
              <h3 className="text-2xl font-semibold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== MENTORSHIP — asymmetric magazine spread ===== */}
      <section className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow">Mentorship</p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-[1.1] tracking-normal">
              A session fixes a problem. <span className="text-primary">Mentorship builds the person who doesn’t have it.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">If you want me working with you directly, on your outreach, your sales conversations, your follow-up and your offers, until winning clients is a skill you own, this is for you.</p>
            <figure className="relative mt-10 ">
              <div className="overflow-hidden">
                <img loading="lazy" src={desk} alt="Dr. Dan at his desk beside a Sales Dr. sash" className="aspect-[16/10] w-full object-cover" />
              </div>
              <blockquote className="relative mt-0 border-l-2 border-primary bg-background p-6 text-foreground md:p-8">
                <span className="absolute -top-7 left-5 font-display text-7xl leading-none text-primary" aria-hidden="true">“</span>
                <p className="text-lg leading-relaxed md:text-xl">“I closed over $127,000 in sales for clients while I was in medical school and building a US-incorporated tech company. No website. No big audience. Just a system that works. I’ve taught it to 150+ people so far. You’re next.”</p>
                <figcaption className="mt-5 font-display text-xs font-bold tracking-[0.18em] text-muted-foreground">Dr. Dan Odotukpono · The Sales Doctor</figcaption>
              </blockquote>
            </figure>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-24">
            <h3 className="text-2xl font-bold tracking-normal">What mentorship gives you</h3>
            <ul className="mt-6">
              {gives.map(([b, d], i) => (
                <li key={b} className="group grid grid-cols-[2rem_1fr] gap-3 border-t border-foreground/15 py-5">
                  <span className="font-display text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <p><strong className="block font-display text-lg font-bold">{b}</strong> <span className="text-muted-foreground">{d}</span></p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CtaLink to="/mentorship" variant="dark" className="w-full">BECOME MY MENTEE →</CtaLink>
              <p className="mt-3 text-sm text-muted-foreground">Tell me where you are. We’ll see if it’s a fit.</p>
            </div>
            <div className="mt-10 border-t border-border pt-7">
              <p className="text-muted-foreground"><strong className="text-foreground">Prefer it done for you?</strong> I also build funnels, run outbound and inbound client acquisition and conversion, and lead campaigns. We’ll work out what fits in your consultation.</p>
              <CtaLink to="/book" variant="outline" className="mt-5">BOOK A CONSULTATION →</CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROOF — numbers as headlines ===== */}
      <section className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">
        <p className="eyebrow">The proof</p>
        <h2 className="mt-4 text-4xl md:text-6xl font-bold leading-[1.1] tracking-normal">The people I’ve helped so far.</h2>
        <div className="mt-12 border-t border-border">
          {proof.map(([n, l]) => (
            <div key={n} className="proof-row group grid items-baseline gap-2 border-b border-foreground/15 py-6 md:grid-cols-[1fr_1fr] md:py-8">
              <p className="font-display text-6xl md:text-8xl font-bold leading-[0.85] tracking-normal transition-colors group-hover:text-primary">{n}</p>
              <p className="max-w-sm text-lg text-muted-foreground md:justify-self-end md:text-right">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-12">
          {testimonials.map(([q, n, r], i) => (
            <figure key={n} className={`flex flex-col ${i === 0 ? "md:col-span-7 md:row-span-2" : "md:col-span-5"}`}>
              <blockquote className={`font-display font-bold leading-snug tracking-normal ${i === 0 ? "text-3xl md:text-4xl" : "text-xl"}`}>
                <span className="text-primary">“</span>{(q ?? "").replace(/^“|”$/g, "")}<span className="text-primary">”</span>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                <span className="h-px w-8 bg-primary" />
                <span><strong className="font-semibold">{n}</strong> <span className="text-muted-foreground">· {r}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===== PHILOSOPHY — dark spread ===== */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 md:px-10 pt-20 md:grid-cols-12 md:pt-28">
          <div className="pb-0 md:col-span-7 md:pb-28">
            <p className="eyebrow">The Sales Doctor philosophy</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-bold leading-[1.1] tracking-normal">The best doctors don’t want you to need them forever.</h2>
            <p className="mt-6 max-w-xl text-lg text-ink-foreground/70">I’ve watched good businesses stall and die because they couldn’t win clients consistently. My job isn’t to make you dependent on me. It’s to help you build the systems, skills and confidence to win clients without me.</p>
            <ul className="mt-10 font-display text-3xl font-bold leading-[1.05] tracking-normal md:text-5xl">
              <li className="text-ink-foreground/70">Diagnose the problem.</li>
              <li className="text-ink-foreground/65">Fix the system.</li>
              <li className="text-blush">Build the capability.</li>
            </ul>
          </div>
          <div className="relative md:col-span-5">
            <img loading="lazy" src={standing.url} alt="Dr. Dan holding up a stethoscope" className="relative mx-auto max-h-[620px] object-contain object-bottom" />
          </div>
        </div>
      </section>

      {/* ===== CLOSE ===== */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:px-10 py-20 md:grid-cols-12 md:items-end md:py-24">
          <h2 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-normal md:col-span-8">Your next target is one conversation away.</h2>
          <div className="md:col-span-4">
            <p className="text-lg opacity-90">Start free, or go deep. Either way, you leave knowing what to do next.</p>
            <CtaLink to="/book" variant="light" className="mt-6 w-full">BOOK A CONSULTATION →</CtaLink>
          </div>
        </div>
      </section>
    </main>
  );
}
