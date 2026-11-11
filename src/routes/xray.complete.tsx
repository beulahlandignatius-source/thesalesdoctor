import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CALL_PURPOSES, type CallPurpose } from "@/lib/xray-booking";
import doctor from "@/assets/mascot-positive.png";

export const Route = createFileRoute("/xray/complete")({
  head: () => ({ meta: [
    { title: "X-Ray Complete · Book a Call | The Sales Clinic" },
    { name: "description", content: "Your business examination has been submitted. Choose the purpose of your call with Dr. Dan, then pick a time on Calendly." },
    { property: "og:title", content: "X-Ray Complete · Your Next Step | The Sales Clinic" },
    { property: "og:description", content: "Choose your call’s purpose and book a time with Dr. Dan." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: XrayComplete,
});

export function XrayComplete() {
  const [booking, setBooking] = useState(false);
  const [purpose, setPurpose] = useState<CallPurpose | undefined>();
  return <main className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
    <div className="flex items-center gap-3 text-primary"><CheckCircle2 className="h-5 w-5" /><p className="eyebrow">SUBMISSION CONFIRMED</p></div>
    <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_180px]">
      <div>
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">Your X-Ray is Complete!</h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">Your business examination has been successfully submitted. Dr. Dan and the team will review your information and get back to you with the next steps.</p>
      </div>
      <img src={doctor} alt="Dr. Dan mascot celebrating your completed X-Ray" className="mx-auto h-40 w-36 object-contain sm:h-56 sm:w-44" />
    </div>
    <section className="mt-8 border-t border-border pt-7">
      {!booking ? <Button variant="premium" size="lg" onClick={() => setBooking(true)}><CalendarDays /> Book a call <ArrowRight /></Button> : <>
        <fieldset>
          <legend className="font-display text-xl font-semibold">What’s the purpose of your call?</legend>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {CALL_PURPOSES.map(item => <label key={item.value} className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${purpose === item.value ? "border-primary bg-secondary" : "border-border bg-background"}`}>
              <input type="radio" name="call-purpose" value={item.value} checked={purpose === item.value} onChange={() => setPurpose(item.value)} className="h-5 w-5 shrink-0 accent-primary" />
              <span className="text-sm font-medium">{item.label}</span>
            </label>)}
          </div>
        </fieldset>
        {purpose ? <Button asChild variant="premium" size="lg" className="mt-6"><Link to="/xray/book" search={{ purpose }}>Continue to Calendly <ArrowRight /></Link></Button> : <Button variant="premium" size="lg" disabled className="mt-6">Continue to Calendly <ArrowRight /></Button>}
      </>}
    </section>
  </main>;
}