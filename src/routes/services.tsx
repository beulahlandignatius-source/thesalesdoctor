import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Stethoscope, ClipboardList, Workflow, GraduationCap, ScanLine, ArrowUpRight, HeartPulse, Megaphone, UserRound, Rocket, Package, Send, MessageCircle, Mail, Handshake, Filter, Settings, Users, Gift } from "lucide-react";
import { btnClass } from "@/components/site";
import { Button } from "@/components/ui/button";
import { LINKS, CLINIC_PRICE } from "@/lib/links";
import redSuit from "@/assets/dr-dan-red-suit.jpg";
import { useMotionFx } from "@/components/motion";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { MascotReveal } from "@/components/mascot-reveal";

export const Route = createFileRoute("/services")({
  head: () => ({ meta: [
    { title: "Sales & Marketing Services | The Sales Clinic with Dr. Dan" },
    { name: "description", content: "Sales and marketing for experts, business owners and founders. Get seen, turn attention into clients and build your client acquisition engine. Start with a diagnosis." },
    { property: "og:title", content: "Sales & Marketing Services | The Sales Clinic" },
    { property: "og:description", content: "Content, campaigns, outreach or systems. Whatever your diagnosis says is broken. Book a consultation with Dr. Dan." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: Services,
});

const PROBLEMS = [
  { title: "Get seen by the right people", subtitle: "People don't know you exist.", items: [
    { icon: Megaphone, line: "Content that brings DMs, not just likes" },
    { icon: UserRound, line: "Personal brand and LinkedIn positioning" },
    { icon: Rocket, line: "Campaigns and launches" },
    { icon: Package, line: "Digital products and lead magnets" },
  ] },
  { title: "Turn attention into clients", subtitle: "People see you, but they don't buy.", items: [
    { icon: Send, line: "Outbound outreach systems" },
    { icon: MessageCircle, line: "DM-to-call and discovery calls" },
    { icon: Mail, line: "Email marketing and nurture" },
    { icon: Handshake, line: "Follow-up and closing" },
  ] },
  { title: "Build the engine", subtitle: "It works, but it all depends on you.", items: [
    { icon: Filter, line: "Sales funnels that pre-sell" },
    { icon: Settings, line: "A full client acquisition system" },
    { icon: Users, line: "Training and leading sales and marketing teams" },
  ] },
];
const DIAGNOSES = [
  { icon: ScanLine, tag: "Free · 5 min", title: "Client X-Ray", body: "A short diagnostic that scans your business and shows exactly where clients are slipping away.", points: ["Instant diagnosis", "Downloadable report", "Your weakest stage, named"], to: "/xray", label: "Start the X-Ray" },
  { icon: Search, tag: "Free · 25 min", title: "Client Acquisition Review", body: "A focused call to find what’s working, what isn’t, and the biggest thing holding your client acquisition back.", points: ["What’s working and what isn’t", "Your biggest blocker", "Your #1 opportunity"], to: "/book/free", label: "Book my free review" },
  { icon: Stethoscope, tag: `${CLINIC_PRICE} · 90 min`, title: "Private Sales Clinic", body: "A working session on your numbers and process, ending with a prioritised plan to hit your next revenue target.", points: ["Leads, conversion and revenue", "Your process, step by step", "A prioritised action plan"], to: "/book/clinic", label: "Book my Sales Clinic" },
] as const;
const ONGOING = [
  { icon: ClipboardList, tag: "Done for you", title: "Full Client Acquisition Audit", body: "A complete audit of how you win clients today: offers, messaging, lead generation and flow, follow-up and conversion.", points: ["Offer and positioning review", "Pipeline and follow-up review", "Written findings and fixes"] },
  { icon: Workflow, tag: "Done with you", title: "Sales Funnel Engine", body: "The weak points from your audit rebuilt into a streamlined, repeatable system that brings pre-sold clients to your calendar.", points: ["Offer and messaging rebuild", "Lead flow and follow-up system", "A system that works without you in the room"] },
  { icon: GraduationCap, tag: "One on one", title: "Mentorship", body: "Work with Dr. Dan directly until winning clients is a skill you own, not something you hope for.", points: ["Positioning and offers", "Outreach and sales calls", "Direct guidance on WhatsApp"] },
];
function ConsultationButton({ light = false }: { light?: boolean }) {
  return <Button asChild className={btnClass(light ? "light" : "primary", "md", "max-w-full !whitespace-normal")}><Link to="/book">BOOK A CONSULTATION <ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></Button>;
}
function Services() {
  useMotionFx();
  return <main className="farmora-home editorial-motion services-refresh overflow-x-clip">
    <section className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.3fr_1fr] md:items-center md:pt-16">
      <div>
        <p className="eyebrow"><HeartPulse className="h-4 w-4 text-primary" aria-hidden="true" /> SERVICES</p>
        <h1 className="mt-5 font-display !text-3xl font-black leading-tight md:!text-4xl lg:!text-5xl">Sales and marketing for experts, business owners and founders who want <span className="text-primary">clients and users, not just attention.</span></h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">My one job: getting you the money. Content, campaigns, outreach or systems. Whatever your diagnosis says is broken.</p>
        <div className="mt-8"><ConsultationButton /></div>
      </div>
      <figure className="services-portrait relative"><img src={redSuit} alt="Dr. Dan Odotukpono in a red suit, seated" className="h-full w-full object-cover object-top" /></figure>
    </section>

    <section className="mx-auto max-w-6xl px-5 pb-16 md:pb-24">
      <div className="flex items-start justify-between gap-4 border-t border-border pt-8"><h2 className="max-w-2xl font-display text-3xl font-black md:text-4xl">Where do you want me to come in?</h2><HeartPulse aria-hidden="true" className="mt-1 h-8 w-8 shrink-0 text-primary" /></div>
      <MascotReveal targets=".service-card" mode="curtain" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">{PROBLEMS.map((problem, i) => <article key={problem.title} className={`!col-span-1 service-card service-card-${i + 1} !min-h-0`}>
        <span className="mb-6 font-display text-sm font-bold opacity-60">0{i + 1}</span>
        <h3 className="font-display text-2xl font-bold leading-tight">{problem.title}</h3>
        <p className="mt-3 text-sm opacity-75">{problem.subtitle}</p>
        <ul className="mt-6 space-y-4 border-t border-current/15 pt-5">{problem.items.map(({ icon: Icon, line }) => <li key={line} className="flex items-start gap-3 text-sm leading-relaxed"><Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /><span>{line}</span></li>)}</ul>
      </article>)}</div>
      <div className="mt-8 flex flex-col items-start justify-between gap-5 border-b border-border pb-8 md:flex-row md:items-center"><p className="text-muted-foreground">Not sure which one is you? That's what the diagnosis is for.</p><ConsultationButton /></div>
    </section>

    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-20">
        <p className="eyebrow">Start with a diagnosis</p>
        <h2 className="mt-3 font-display text-3xl font-black md:text-4xl">Find what’s broken first.</h2>
        <MascotReveal targets=".service-card" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">{DIAGNOSES.map((s, i) => { const Icon = s.icon; return <article key={s.title} className={`!col-span-1 service-card service-card-${i + 1}`}>
          <div className="flex items-start justify-between gap-3"><span className="service-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="service-tag">{s.tag}</span></div>
          <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3><p className="mt-3 text-sm leading-relaxed opacity-80">{s.body}</p>
          <ul className="mt-5 space-y-2 text-sm">{s.points.map(point => <li key={point} className="flex gap-2"><span className="service-dot" aria-hidden="true" />{point}</li>)}</ul>
          {s.to === "/book/clinic" && <div className="mt-5 flex items-center gap-2 border-y border-current/20 py-3 text-sm font-semibold"><Gift aria-hidden="true" className="h-4 w-4" />5 free bonuses included</div>}
          <div className="mt-auto pt-6"><Button asChild variant="link" className="!text-current service-cta !h-auto !min-h-0 !rounded-none !px-0 !text-left !whitespace-normal"><Link to={s.to}>{s.label}<ArrowUpRight aria-hidden="true" /></Link></Button></div>
        </article>; })}</div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <p className="eyebrow">Beyond the diagnosis</p><h2 className="mt-3 font-display text-3xl font-black md:text-4xl">Many More Ways to work with me</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{ONGOING.map((s, i) => { const Icon = s.icon; return <article key={s.title} className={`!col-span-1 service-card service-card-${i === 2 ? 6 : i + 4}`}>
        <div className="flex items-start justify-between gap-3"><span className="service-icon"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="service-tag">{s.tag}</span></div>
        <h3 className="mt-6 font-display text-2xl font-bold">{s.title}</h3><p className="mt-3 text-sm leading-relaxed opacity-80">{s.body}</p>
        <ul className="mt-5 space-y-2 text-sm">{s.points.map(point => <li key={point} className="flex gap-2"><span className="service-dot" aria-hidden="true" />{point}</li>)}</ul>
        <div className="mt-auto pt-6"><Button asChild variant="link" className="!text-current service-cta !h-auto !min-h-0 !rounded-none !px-0 !text-left !whitespace-normal"><a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Ask on WhatsApp<ArrowUpRight aria-hidden="true" /></a></Button></div>
      </article>; })}</div>
    </section>
  </main>;
}
