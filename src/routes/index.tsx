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
    <main>
      {/* Opening */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.15fr_1fr] md:pb-24 md:pt-16">
          <div>
            <p className="eyebrow">With Dr. Dan Odotukpono, The Sales Doctor</p>
            <h1 className="mt-5 text-[2.6rem] font-black leading-[1.02] md:text-7xl">
              What would it take to get you to your <span className="text-primary">next revenue target?</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Whether you’re chasing your first clients or trying to break past your best month yet, we’ll look at your goals, your numbers and how you win clients, and pinpoint exactly what has to change to get you there.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaLink to="/book">BOOK A CONSULTATION</CtaLink>
              <p className="text-sm text-muted-foreground">Free 25-min option available<br />Takes 2 minutes to book</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-6 -top-6 h-full w-full rounded-2xl bg-blush" />
            <img src={portrait.url} alt="Dr. Dan Odotukpono, The Sales Doctor, smiling with a stethoscope" className="relative aspect-[4/5] w-full rounded-2xl object-cover object-top shadow-2xl" />
          </div>
        </div>
        <div className="border-y border-border bg-card">
          <dl className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-2">
            {stats.map(([n, l]) => (
              <div key={n} className="px-3 py-6 text-center">
                <dt className="font-display text-2xl font-black text-primary md:text-4xl">{n}</dt>
                <dd className="mt-1 text-xs text-muted-foreground md:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Your session */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">Your session</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">3 questions we answer</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {questions.map(([n, t, d]) => (
            <div key={n} className="border-t-[3px] border-foreground pt-5">
              <p className="font-display text-sm font-bold text-primary">{n}</p>
              <h3 className="mt-2 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <p className="eyebrow">Who this is for</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-5xl">You don’t have to be stuck to need a better system. You just need a bigger target.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {who.map(([q, d]) => (
              <div key={q} className="rounded-xl border border-ink-foreground/15 bg-ink-foreground/5 p-6">
                <h3 className="text-xl font-bold">{q}</h3>
                <p className="mt-2 text-ink-foreground/70">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <CtaLink to="/book">FIND MY NEXT STEP →</CtaLink>
            <p className="text-sm text-ink-foreground/70">Sound like you? Pick the session that fits.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">How it works</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-extrabold md:text-5xl">From “not sure what’s wrong” to “I know exactly what to do.”</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl bg-blush p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display font-black text-primary-foreground">{i + 1}</span>
              <h3 className="mt-4 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Mentorship */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="eyebrow">Mentorship</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">A session fixes a problem. Mentorship builds the person who doesn’t have it.</h2>
            <p className="mt-5 text-lg text-muted-foreground">If you want me working with you directly, on your outreach, your sales conversations, your follow-up and your offers, until winning clients is a skill you own, this is for you.</p>
            <figure className="mt-8 overflow-hidden rounded-2xl bg-ink text-ink-foreground">
              <img src={desk} alt="Dr. Dan at his desk beside a Sales Dr. sash" className="aspect-[16/10] w-full object-cover" />
              <blockquote className="p-6">
                <p className="text-lg leading-relaxed">“I closed over $127,000 in sales for clients while I was in medical school and building a US-incorporated tech company. No website. No big audience. Just a system that works. I’ve taught it to 150+ people so far. You’re next.”</p>
                <figcaption className="mt-4 text-sm font-semibold text-ink-foreground/70">Dr. Dan Odotukpono · The Sales Doctor</figcaption>
              </blockquote>
            </figure>
          </div>
          <div className="md:pt-14">
            <h3 className="text-2xl font-bold">What mentorship gives you</h3>
            <ul className="mt-6 space-y-5">
              {gives.map(([b, d]) => (
                <li key={b} className="flex gap-4">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-primary" />
                  <p><strong className="font-semibold">{b}</strong> <span className="text-muted-foreground">{d}</span></p>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaLink to="/mentorship" variant="dark">BECOME MY MENTEE →</CtaLink>
              <p className="mt-3 text-sm text-muted-foreground">Tell me where you are. We’ll see if it’s a fit.</p>
            </div>
            <div className="mt-10 rounded-xl border-2 border-dashed border-primary/40 p-6">
              <p className="text-muted-foreground"><strong className="text-foreground">Prefer it done for you?</strong> I also build funnels, run outbound and inbound client acquisition and conversion, and lead campaigns. We’ll work out what fits in your consultation.</p>
              <CtaLink to="/book" variant="outline" className="mt-5">BOOK A CONSULTATION →</CtaLink>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow">The proof</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">The people I’ve helped so far.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {proof.map(([n, l]) => (
            <div key={n} className="border-l-4 border-primary pl-5">
              <p className="font-display text-5xl font-black">{n}</p>
              <p className="mt-2 text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map(([q, n, r]) => (
            <figure key={n} className="flex flex-col rounded-xl border border-border bg-card p-6">
              <span className="font-display text-5xl leading-none text-primary">“</span>
              <blockquote className="mt-2 flex-1">{(q ?? "").replace(/^“|”$/g, "")}</blockquote>
              <figcaption className="mt-5 border-t border-border pt-4">
                <p className="font-semibold">{n}</p>
                <p className="text-sm text-muted-foreground">{r}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="eyebrow">The Sales Doctor philosophy</p>
            <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">The best doctors don’t want you to need them forever.</h2>
            <p className="mt-5 text-lg text-ink-foreground/75">I’ve watched good businesses stall and die because they couldn’t win clients consistently. My job isn’t to make you dependent on me. It’s to help you build the systems, skills and confidence to win clients without me.</p>
            <ul className="mt-8 space-y-2 font-display text-2xl font-bold">
              <li>Diagnose the problem.</li>
              <li>Fix the system.</li>
              <li className="text-primary">Build the capability.</li>
            </ul>
          </div>
          <img src={standing.url} alt="Dr. Dan holding up a stethoscope" className="mx-auto max-h-[560px] rounded-2xl object-cover" />
        </div>
      </section>

      {/* Close */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="text-3xl font-black md:text-5xl">Your next target is one conversation away.</h2>
          <p className="mt-4 text-lg opacity-90">Start free, or go deep. Either way, you leave knowing what to do next.</p>
          <CtaLink to="/book" variant="light" className="mt-8">BOOK A CONSULTATION →</CtaLink>
        </div>
      </section>
    </main>
  );
}
