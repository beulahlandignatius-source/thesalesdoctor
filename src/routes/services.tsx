import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Stethoscope, ClipboardList, Workflow, GraduationCap, ScanLine, ArrowUpRight, Target, Route as RouteIcon, Timer, HeartPulse } from "lucide-react";
import { btnClass, ExtLink } from "@/components/site";
import { LINKS, CLINIC_PRICE } from "@/lib/links";
import redSuit from "@/assets/dr-dan-red-suit.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Dr. Dan, The Sales Doctor" },
      { name: "description", content: "Sales audits, the Sales Funnel Engine, the Private Sales Clinic, mentorship and the Client X-Ray. Client acquisition systems for coaches, consultants and experts." },
      { property: "og:title", content: "Services | The Sales Clinic with Dr. Dan" },
      { property: "og:description", content: "Diagnose the problem, fix the system, build the capability. Every way to work with Dr. Dan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Services,
});

type Svc = { icon: typeof Search; tag: string; title: string; body: string; points: string[]; cta: { label: string; to?: "/book/free" | "/book/clinic" | "/mentorship" | "/xray"; href?: string } };
const SERVICES: Svc[] = [
  { icon: ScanLine, tag: "Free · 5 min", title: "Client X-Ray", body: "A short diagnostic that scans your business and shows exactly where clients are slipping away.", points: ["Instant diagnosis", "Downloadable report", "Your weakest stage, named"], cta: { label: "Start the X-Ray", to: "/xray" } },
  { icon: Search, tag: "Free · 25 min", title: "Client Acquisition Review", body: "A focused call to find what’s working, what isn’t, and the biggest thing holding your client acquisition back.", points: ["What’s working and what isn’t", "Your biggest blocker", "Your #1 opportunity"], cta: { label: "Book my free review", to: "/book/free" } },
  { icon: Stethoscope, tag: `${CLINIC_PRICE} · 90 min`, title: "Private Sales Clinic", body: "A working session on your numbers and process, ending with a prioritised plan to hit your next revenue target.", points: ["Leads, conversion and revenue", "Your process, step by step", "A prioritised action plan"], cta: { label: "Book my Sales Clinic", to: "/book/clinic" } },
  { icon: ClipboardList, tag: "Done for you", title: "Full Sales Audit", body: "A complete audit of how you win clients today: offers, messaging, lead generation and flow, follow-up and conversion.", points: ["Offer and positioning review", "Pipeline and follow-up review", "Written findings and fixes"], cta: { label: "Ask on WhatsApp", href: LINKS.whatsapp } },
  { icon: Workflow, tag: "Done with you", title: "Sales Funnel Engine", body: "The weak points from your audit rebuilt into a streamlined, repeatable system that brings pre-sold clients to your calendar.", points: ["Offer and messaging rebuild", "Lead flow and follow-up system", "A system that works without you in the room"], cta: { label: "Ask on WhatsApp", href: LINKS.whatsapp } },
  { icon: GraduationCap, tag: "One to one", title: "Mentorship", body: "Work with Dr. Dan directly until winning clients is a skill you own, not something you hope for.", points: ["Positioning and offers", "Outreach and sales calls", "Direct guidance on WhatsApp"], cta: { label: "Become my mentee", to: "/mentorship" } },
];
const PRINCIPLES = [
  { icon: Target, title: "Positioning precision", body: "Your offer must create instant desire, not curiosity." },
  { icon: RouteIcon, title: "Pipeline clarity", body: "Every lead needs a clear path to a yes." },
  { icon: Timer, title: "Follow-up velocity", body: "Most revenue is lost after the first touchpoint." },
];

function Services() {
  return <main className="farmora-home overflow-x-clip">
    <section className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.3fr_1fr] md:items-center md:pt-16">
      <div aria-hidden className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blush opacity-70 blur-3xl" />
      <div className="relative">
        <p className="eyebrow"><HeartPulse className="h-4 w-4 text-primary" aria-hidden="true" /> Services</p>
        <h1 className="mt-5 font-display text-5xl font-black leading-[0.95] md:text-7xl">Every way to <span className="text-primary">fix your sales.</span></h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">Most coaches and experts think they have a client problem. What they actually have is a sales system problem. Pick where you want to start.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/book" className={btnClass("primary", "md")}>Book a consultation →</Link><Link to="/xray" className={btnClass("outline", "md")}>Take the Client X-Ray</Link></div>
      </div>
      <figure className="services-portrait relative"><img src={redSuit} alt="Dr. Dan Odotukpono in a red suit, seated" className="h-full w-full object-cover object-top" /><figcaption className="services-portrait-tag"><span className="font-display text-3xl font-black">128+</span><span className="text-xs">sales processes audited</span></figcaption></figure>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-20">
      <div className="services-grid">
        {SERVICES.map((s, i) => { const Icon = s.icon; return <article key={s.title} className={`service-card service-card-${i + 1}`}>
          <div className="flex items-start justify-between gap-3"><span className="service-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="service-tag">{s.tag}</span></div>
          <p className="service-num" aria-hidden="true">0{i + 1}</p>
          <h2 className="mt-2 font-display text-2xl font-black md:text-3xl">{s.title}</h2>
          <p className="mt-3 opacity-80">{s.body}</p>
          <ul className="mt-5 space-y-2 text-sm">{s.points.map((p) => <li key={p} className="flex gap-2"><span className="service-dot" aria-hidden="true" />{p}</li>)}</ul>
          <div className="mt-auto pt-6">{s.cta.to ? <Link to={s.cta.to} className="service-cta">{s.cta.label} <ArrowUpRight className="h-4 w-4" /></Link> : <a href={s.cta.href} target="_blank" rel="noopener noreferrer" className="service-cta">{s.cta.label} <ArrowUpRight className="h-4 w-4" /></a>}</div>
        </article>; })}
      </div>
    </section>

    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <p className="eyebrow !text-ink-foreground">The framework</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight md:text-5xl">Built on three principles.</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">{PRINCIPLES.map((p, i) => { const Icon = p.icon; return <div key={p.title} className="principle-tile"><span className="flex items-center justify-between"><span className="service-icon"><Icon className="h-5 w-5" /></span><span className="font-display text-sm opacity-50">0{i + 1}</span></span><h3 className="mt-8 font-display text-xl font-bold">{p.title}</h3><p className="mt-2 opacity-70">{p.body}</p></div>; })}</div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="close-card rounded-[2.5rem] bg-primary p-8 text-primary-foreground md:p-14">
        <h2 className="max-w-2xl font-display text-4xl font-black leading-tight md:text-5xl">Not sure which one? Start free.</h2>
        <p className="mt-4 max-w-xl opacity-85">Book the free 25-minute review and Dr. Dan will tell you where to go next.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/book/free" className={btnClass("light", "md")}>Book my free review →</Link><ExtLink href={LINKS.whatsapp} variant="dark">Chat on WhatsApp</ExtLink></div>
      </div>
    </section>
  </main>;
}
