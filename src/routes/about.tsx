import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartPulse, Brain, Stethoscope, Rocket, Users, Megaphone, Quote, Linkedin } from "lucide-react";
import { btnClass, ExtLink } from "@/components/site";
import { LINKS } from "@/lib/links";
import blushJacket from "@/assets/dr-dan-blush-jacket.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Dr. Dan Odotukpono | The Sales Doctor" },
      { name: "description", content: "Medical doctor, sales strategist and founder. How Dr. Dan Odotukpono became The Sales Doctor, helping coaches and experts acquire clients predictably." },
      { property: "og:title", content: "About Dr. Dan Odotukpono, The Sales Doctor" },
      { property: "og:description", content: "From neuroscience to sales: the story behind The Sales Clinic." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

const STATS = [["$127K+", "in sales closed for clients and brands"], ["128+", "sales processes audited"], ["30+", "brands and clients served"], ["50+", "students closed their first high-ticket client"]];
const STORY = [
  { icon: Brain, title: "The brain came first", body: "For years I dreamed of becoming a neurosurgeon. I spent countless hours learning neuroscience, psychology and why humans behave the way they do." },
  { icon: Megaphone, title: "Then marketing clicked", body: "I realised I could apply everything I knew about people to selling, positioning and business. It worked, for my clients and for me." },
  { icon: Stethoscope, title: "A doctor, twice over", body: "In 2026 I was inducted as a medical doctor. Around here, they also call me The Sales Doctor, and both jobs share one goal." },
];
const BUILT = [
  { icon: Rocket, title: "Enski", body: "Founder. A platform connecting people who know things with people who need to learn them, reaching 1,000+ learners and hundreds of creators." },
  { icon: Megaphone, title: "Credence", body: "Chief Marketing Officer. Helped build the agency from the ground up with a vision of becoming Africa’s largest marketing agency." },
  { icon: Users, title: "Dreamers Trybe", body: "Co-founder. A community on a mission to empower 50,000 people, with 2,600+ members and 20+ landing high-paying roles in its first weeks." },
];

function About() {
  return <main className="farmora-home overflow-x-clip">
    <section className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1fr_1.2fr] md:items-center md:pt-16">
      <figure className="about-portrait"><img src={blushJacket} alt="Dr. Dan Odotukpono standing, smiling" className="h-full w-full object-cover object-top" /></figure>
      <div>
        <p className="eyebrow"><HeartPulse className="h-4 w-4 text-primary" aria-hidden="true" /> About</p>
        <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] md:text-7xl">I’m Dan. <span className="text-primary">Dr. Dan,</span> actually.</h1>
        <p className="mt-6 text-lg text-muted-foreground">Sales-driven growth strategist, medical doctor and founder. I build client acquisition systems for coaches, consultants and knowledge-based businesses, where sales psychology, positioning and client acquisition meet.</p>
        <p className="mt-4 text-muted-foreground">Based in Abuja, Nigeria, working with clients across Africa, the UK and beyond.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/book" className={btnClass("primary", "md")}>Book a consultation →</Link><ExtLink href={LINKS.linkedin} variant="outline"><Linkedin className="h-4 w-4" /> Follow on LinkedIn</ExtLink></div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-20">
      <dl className="about-stats">{STATS.map(([n, l], i) => <div key={n} className={`about-stat about-stat-${i + 1}`}><dt className="font-display text-4xl font-black md:text-5xl">{n}</dt><dd className="mt-2 text-sm opacity-80">{l}</dd></div>)}</dl>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-20">
      <p className="eyebrow">The story</p>
      <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight md:text-5xl">From neuroscience to <span className="text-primary">sales.</span></h2>
      <ol className="about-timeline mt-10">{STORY.map((s, i) => { const Icon = s.icon; return <li key={s.title} className="about-step"><span className="about-step-icon"><Icon className="h-5 w-5" /></span><div><p className="text-xs font-bold text-primary">0{i + 1}</p><h3 className="font-display text-xl font-bold">{s.title}</h3><p className="mt-2 text-muted-foreground">{s.body}</p></div></li>; })}</ol>
    </section>

    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div><Quote className="h-10 w-10 text-primary" aria-hidden="true" /><p className="mt-6 font-display text-3xl font-black leading-tight md:text-4xl">“A good doctor’s goal is a patient who no longer needs them.”</p>
          <p className="mt-6 opacity-70">That’s why I became The Sales Doctor. Every brand that walks in almost dead should leave standing on its own, with a system that keeps working after I leave.</p></div>
        <div className="grid gap-4">{BUILT.map((b) => { const Icon = b.icon; return <div key={b.title} className="principle-tile flex gap-4"><span className="service-icon shrink-0"><Icon className="h-5 w-5" /></span><div><h3 className="font-display text-lg font-bold">{b.title}</h3><p className="mt-1 text-sm opacity-70">{b.body}</p></div></div>; })}</div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="close-card rounded-[2.5rem] bg-primary p-8 text-primary-foreground md:p-14">
        <h2 className="max-w-2xl font-display text-4xl font-black leading-tight md:text-5xl">If you have a dream, don’t give up on it.</h2>
        <p className="mt-4 max-w-xl opacity-85">I was once where you are, and I’m always rooting for you. Let’s find what’s holding your sales back.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/book" className={btnClass("light", "md")}>Book a consultation →</Link><Link to="/services" className={btnClass("dark", "md")}>See services</Link></div>
      </div>
    </section>
  </main>;
}
