import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { logBookingStep } from "@/lib/booking-funnel.functions";

type Session = "free_review" | "private_clinic";
const log = (session: Session, step: "viewed" | "started" | "completed") => { logBookingStep({ data: { session, step } }).catch(() => {}); };

export function CalendlyEmbed({ src, session, onOpen, onBooked }: { src: string; session: Session; onOpen?: () => void; onBooked?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const [booked, setBooked] = useState(false);
  const [frameSrc, setFrameSrc] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(src);
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("embed_domain", window.location.hostname);
    url.searchParams.set("embed_type", "Inline");
    setFrameSrc(url.toString());
    const onMsg = (e: MessageEvent) => {
      if (typeof e.origin === "string" && !e.origin.endsWith("calendly.com")) return;
      if (e.data?.event === "calendly.date_and_time_selected") { window.__lovableEvents?.track?.("project.booking_started", { session }); log(session, "started"); }
      if (e.data?.event === "calendly.event_scheduled") { window.__lovableEvents?.track?.("project.booking_completed", { session }); log(session, "completed"); setBooked(true); onBooked?.(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [src]);

  if (booked) {
    return (
      <div role="status" className="mt-5 rounded-[1.5rem] border border-border bg-secondary p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground"><CalendarCheck className="h-6 w-6" /></span>
        <h2 className="mt-4 text-2xl font-extrabold">You’re booked in.</h2>
        <p className="mt-2 text-muted-foreground">Your session with Dr. Dan is confirmed. Calendly has sent the details and calendar invite to your email.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card">
        {!loaded && (
          <div role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="sr-only">Loading appointment calendar…</span>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        )}
        {frameSrc && <iframe title="Book with Dr. Dan" src={frameSrc} onLoad={() => { if (!loaded) { log(session, "viewed"); onOpen?.(); } setLoaded(true); }} className="h-[1000px] w-full md:h-[720px]" />}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Calendar not loading?{" "}
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open it in a new tab</a>
      </p>
    </div>
  );
}
