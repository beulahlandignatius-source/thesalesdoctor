import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CalendlyEmbed } from "@/components/calendly-embed";
import { calendlyUrl } from "@/lib/links";

const search = z.object({
  session: z.enum(["free", "clinic"]).catch("free"),
  name: z.string().optional().catch(undefined),
  email: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/book/schedule")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Choose your time — The Sales Clinic" },
      { name: "description", content: "Pick a time for your session with Dr. Dan." },
      { property: "og:title", content: "Choose your time — The Sales Clinic" },
      { property: "og:description", content: "Pick a time for your session with Dr. Dan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Schedule,
});

function Schedule() {
  const { session, name, email } = Route.useSearch();
  const clinic = session === "clinic";
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28">
      <Link to={clinic ? "/book/clinic" : "/book/free"} className="text-sm text-muted-foreground">← Back</Link>
      <div className="mt-4 text-center">
        <p className="eyebrow">{clinic ? "Private Sales Clinic · 90 minutes" : "Free · 25 minutes"}</p>
        <h1 className="mt-3 text-4xl font-extrabold">{clinic ? "Paid? Choose your 90-minute slot." : "Now pick your time."}</h1>
        <p className="mt-2 text-muted-foreground">Choose a time that suits you.</p>
      </div>
      <CalendlyEmbed session={clinic ? "private_clinic" : "free_review"} src={calendlyUrl(name, email)} onOpen={() => window.__lovableEvents?.track?.("project.consultation_booking_opened", { session: clinic ? "private_clinic" : "free_review" })} />
    </main>
  );
}
