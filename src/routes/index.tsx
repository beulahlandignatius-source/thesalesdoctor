import { createFileRoute } from "@tanstack/react-router";
import { CtaLink } from "@/components/site";
import { ClientReviews, reviewsQuery } from "@/components/client-reviews";
import { StackedCards } from "@/components/stacked-cards";
import { CalendarDays, ClipboardList, TrendingUp, BadgeDollarSign, Users, Globe2 } from "lucide-react";
import desk from "@/assets/dr-dan-desk.jpg";
import portrait from "@/assets/dr-dan-portrait.jpg.asset.json";
import standing from "@/assets/dr-dan-standing.jpg.asset.json";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQuery),
  head: () => ({
    meta: [
      { title: "The Sales Clinic — Dr. Dan, The Sales Doctor" },
      { name: "description", content: "What would it take to get you to your next revenue target? Book a free 25-min review or a 90-min Private Sales Clinic with Dr. Dan." },
      { property: "og:title", content: "The Sales Clinic — Dr. Dan, The Sales Doctor" },
      { property: "og:description", content: "Pinpoint exactly what has to change to hit your next revenue target." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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

/** Pulse line that turns into a rising revenue curve — diagnostics meets growth. */
function Pulse({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 80" fill="none" aria-hidden="true" className={className} preserveAspectRatio="none">
      <path className="ecg" d="M0 60 H150 L170 60 L185 20 L200 72 L215 44 L230 60 H330 L345 54 L360 30 L380 66 L395 50 C450 44 520 22 600 4" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

function Index() {
  return (
    <main className="farmora-home overflow-x-clip">
      {/* ===== HERO ===== */}
      <section className="relative">
        <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-10 pt-8 md:grid-cols-12 md:gap-6 md:pb-16 md:pt-14">
          <div className="md:col-span-7 md:pt-6">
            <p className="eyebrow flex items-center gap-3"><span className="h-px w-10 bg-primary" />With Dr. Dan Odotukpono, The Sales Doctor</p>
            <h1 className="mt-6 font-black uppercase leading-[0.88] tracking-[-0.045em] text-[clamp(2.9rem,9.2vw,7.4rem)] md:text-[clamp(3.5rem,6.4vw,6.2rem)]">
              What would it take to get you to your{" "}
              <span className="relative inline text-primary">next revenue target?</span>
            </h1>
            <Pulse className="mt-6 h-12 w-full text-primary md:h-16" />
            <div className="mt-6 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Whether you’re chasing your first clients or trying to break past your best month yet, we’ll look at your goals, your numbers and how you win clients, and pinpoint exactly what has to change to get you there.
              </p>
              <div>
                <CtaLink to="/book" className="w-full md:w-auto">BOOK A CONSULTATION</CtaLink>
                <p className="mt-3 border-l-2 border-primary pl-3 text-sm text-muted-foreground">Free 25-min option available<br />Takes 2 minutes to book</p>
              </div>
            </div>
          </div>

          <div className="relative md:col-span-5">
            <div className="relative ml-6 md:ml-0">
              <div className="absolute -left-6 -top-6 h-full w-full bg-primary md:-left-8 md:-top-8" aria-hidden="true" />
              <div className="relative overflow-hidden bg-ink">
                <img src={portrait.url} alt="Dr. Dan Odotukpono, The Sales Doctor, smiling with a stethoscope" className="aspect-[4/5] w-full object-cover object-top" />
                {/* diagnostic overlay */}
                <div className="scan pointer-events-none absolute inset-0" aria-hidden="true" />
                <span className="crosshair absolute left-4 top-4" aria-hidden="true" />
                <span className="crosshair absolute bottom-4 right-4 rotate-180" aria-hidden="true" />
              </div>
              <p className="absolute -bottom-5 left-0 bg-ink px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.2em] text-ink-foreground md:-left-10">
                The Sales <span className="text-primary">Doctor</span>
              </p>
            </div>
          </div>
        </div>

        {/* stats ledger */}
        <dl className="relative mx-auto mt-6 grid max-w-7xl grid-cols-3 border-y-2 border-foreground">
          {stats.map(([n, l], i) => (
            <div key={n} className={`px-3 py-5 md:px-8 md:py-8 ${i ? "border-l border-foreground/20" : ""}`}>
              <dt className="font-display text-[clamp(1.6rem,6vw,4.5rem)] font-black leading-none tracking-tight">{n}</dt>
              <dd className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:text-xs">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ===== 3 QUESTIONS — the funnel ===== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Your session</p>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl">3 questions we answer</h2>
          </div>
          <ol className="md:col-span-8">
            {questions.map(([n, t, d], i) => (
              <li key={n} className="funnel-row group grid grid-cols-[auto_1fr] items-baseline gap-5 border-t-2 border-foreground py-7 md:gap-10" style={{ marginRight: `${i * 8}%` }}>
                <span className="font-display text-6xl font-black leading-none text-primary/25 transition-colors group-hover:text-primary md:text-8xl">{n}</span>
                <div>
                  <h3 className="text-2xl font-extrabold md:text-3xl">{t}</h3>
                  <p className="mt-2 max-w-md text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== WHO — dark editorial ===== */}
      <section className="relative bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <p className="eyebrow">Who this is for</p>
          <h2 className="mt-5 max-w-5xl text-[clamp(2rem,5.5vw,4.75rem)] font-black leading-[0.95] tracking-tight">
            You don’t have to be stuck to need a better system. <span className="text-primary">You just need a bigger target.</span>
          </h2>
          <div className="mt-14 grid md:grid-cols-2">
            {who.map(([q, d], i) => (
              <div key={q} className={`symptom group border-t border-ink-foreground/20 py-8 md:px-8 ${i % 2 ? "md:border-l" : "md:pl-0"}`}>
                <p className="font-display text-xs font-bold tracking-[0.2em] text-primary">0{i + 1}</p>
                <h3 className="mt-3 text-2xl font-extrabold leading-tight transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">{q}</h3>
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
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="eyebrow md:col-span-12">How it works</p>
          <h2 className="text-[clamp(2rem,5vw,4.25rem)] font-black leading-[0.95] tracking-tight md:col-span-9">
            From “not sure what’s wrong” to <span className="marker">“I know exactly what to do.”</span>
          </h2>
        </div>
        <div className="mt-14">
          <StackedCards label="session step" items={steps.map(([t, d], i) => {
            const Icon = [CalendarDays, ClipboardList, TrendingUp][i] ?? CalendarDays;
            return <><div className="stack-badge"><Icon className="h-10 w-10" /><span className="stack-number">{i + 1}</span></div><span className="stack-step mt-6">Step {String(i + 1).padStart(2, "0")}</span><h3 className="mt-5 text-2xl font-extrabold">{t}</h3><p className="mt-3 text-base leading-relaxed text-muted-foreground">{d}</p></>;
          })} />
        </div>
      </section>

      {/* ===== MENTORSHIP — asymmetric magazine spread ===== */}
      <section className="mentorship-spread">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow">Mentorship</p>
            <h2 className="mt-4 text-[clamp(2rem,4.8vw,4rem)] font-black leading-[0.95] tracking-tight">
              A session fixes a problem. <span className="text-primary">Mentorship builds the person who doesn’t have it.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">If you want me working with you directly, on your outreach, your sales conversations, your follow-up and your offers, until winning clients is a skill you own, this is for you.</p>
            <figure className="relative mt-10 md:-mr-24">
              <div className="overflow-hidden">
                <img src={desk} alt="Dr. Dan at his desk beside a Sales Dr. sash" className="aspect-[16/10] w-full object-cover" />
              </div>
              <blockquote className="relative -mt-10 ml-4 bg-ink p-6 text-ink-foreground md:-mt-24 md:ml-auto md:w-[78%] md:p-8">
                <span className="absolute -top-7 left-5 font-display text-7xl leading-none text-primary" aria-hidden="true">“</span>
                <p className="text-lg leading-relaxed md:text-xl">“I closed over $127,000 in sales for clients while I was in medical school and building a US-incorporated tech company. No website. No big audience. Just a system that works. I’ve taught it to 150+ people so far. You’re next.”</p>
                <figcaption className="mt-5 font-display text-xs font-bold uppercase tracking-[0.18em] text-ink-foreground/60">Dr. Dan Odotukpono · The Sales Doctor</figcaption>
              </blockquote>
            </figure>
          </div>
          <div className="mentorship-benefits md:col-span-4 md:col-start-9 md:pt-24">
            <h3 className="text-2xl font-black uppercase tracking-tight">What mentorship gives you</h3>
            <ul className="mt-6">
              {gives.map(([b, d], i) => (
                <li key={b} className="mentorship-benefit group grid grid-cols-[2rem_1fr] gap-3">
                  <span className="benefit-number font-display text-sm font-black">{String(i + 1).padStart(2, "0")}</span>
                  <p><strong className="block font-display text-lg font-bold">{b}</strong> <span className="benefit-detail">{d}</span></p>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CtaLink to="/mentorship" variant="dark" className="w-full">BECOME MY MENTEE →</CtaLink>
              <p className="mt-3 text-sm text-muted-foreground">Tell me where you are. We’ll see if it’s a fit.</p>
            </div>
            <div className="mentorship-alternative mt-10 border-l-4 border-primary bg-background p-6">
              <p className="text-muted-foreground"><strong className="text-foreground">Prefer it done for you?</strong> I also build funnels, run outbound and inbound client acquisition and conversion, and lead campaigns. We’ll work out what fits in your consultation.</p>
              <CtaLink to="/book" variant="outline" className="mt-5">BOOK A CONSULTATION →</CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROOF — numbers as headlines ===== */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
        <p className="eyebrow">The proof</p>
        <h2 className="mt-4 text-[clamp(2rem,5vw,4.25rem)] font-black leading-[0.95] tracking-tight">The people I’ve helped so far.</h2>
        <div className="proof-bento mt-12">
          {proof.map(([n, l], i) => {
            const Icon = [BadgeDollarSign, Users, Globe2][i] ?? TrendingUp;
            return <article key={n} className={`proof-tile proof-tile-${i + 1}`}>
              <div className="flex items-center justify-between"><span className="proof-icon"><Icon aria-hidden="true" className="h-6 w-6" /></span><Pulse className="h-8 w-28 opacity-70" /></div>
              <p className="proof-number font-display font-black">{n}</p>
              <p className="proof-label">{l}</p>
            </article>;
          })}
        </div>
        <ClientReviews existing={testimonials} />
      </section>

      {/* ===== PHILOSOPHY — dark spread ===== */}
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-5 pt-20 md:grid-cols-12 md:pt-28">
          <div className="pb-0 md:col-span-7 md:pb-28">
            <p className="eyebrow">The Sales Doctor philosophy</p>
            <h2 className="mt-4 text-[clamp(2.2rem,5.5vw,4.75rem)] font-black leading-[0.92] tracking-tight">The best doctors don’t want you to need them forever.</h2>
            <p className="mt-6 max-w-xl text-lg text-ink-foreground/70">I’ve watched good businesses stall and die because they couldn’t win clients consistently. My job isn’t to make you dependent on me. It’s to help you build the systems, skills and confidence to win clients without me.</p>
            <ul className="mt-10 font-display text-3xl font-black uppercase leading-[1.05] tracking-tight md:text-5xl">
              <li className="text-ink-foreground/35">Diagnose the problem.</li>
              <li className="text-ink-foreground/65">Fix the system.</li>
              <li className="text-primary">Build the capability.</li>
            </ul>
          </div>
          <div className="relative md:col-span-5">
            <Pulse className="absolute inset-x-0 top-1/3 h-20 w-full text-primary/60" />
            <img src={standing.url} alt="Dr. Dan holding up a stethoscope" className="relative mx-auto max-h-[620px] object-contain object-bottom" />
          </div>
        </div>
      </section>

      {/* ===== CLOSE ===== */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-12 md:items-end md:py-24">
          <h2 className="text-[clamp(2.4rem,6.5vw,5.75rem)] font-black uppercase leading-[0.88] tracking-[-0.04em] md:col-span-8">Your next target is one conversation away.</h2>
          <div className="md:col-span-4">
            <p className="text-lg opacity-90">Start free, or go deep. Either way, you leave knowing what to do next.</p>
            <CtaLink to="/book" variant="light" className="mt-6 w-full">BOOK A CONSULTATION →</CtaLink>
          </div>
        </div>
      </section>
    </main>
  );
}
