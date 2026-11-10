import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ArrowUpRight } from "lucide-react";
import { F, FormError, FormShell, Options, StuckPicker, field, privacy, useEnquiry } from "@/components/form-bits";
import { btnClass, ExtLink } from "@/components/site";
import { LINKS, TARGETS } from "@/lib/links";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book/free")({
  head: () => ({
    meta: [
      { title: "Book your free Client Acquisition Review | The Sales Clinic" },
      { name: "description", content: "A focused 25 minutes with Dr. Dan on your goals, what’s working and your biggest opportunity to grow." },
      { property: "og:title", content: "Free Client Acquisition Review | The Sales Clinic" },
      { property: "og:description", content: "A focused 25 minutes on your goals and your biggest opportunity to grow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Free,
});

export function Free() {
  const [submitted, setSubmitted] = useState(false);
  const confirmation = useRef<HTMLHeadingElement>(null);
  const { save, busy, error } = useEnquiry("free_review");
  useEffect(() => {
    if (!submitted) return;
    confirmation.current?.focus();
    confirmation.current?.scrollIntoView({ behavior: "instant", block: "center" });
  }, [submitted]);
  return (
    <FormShell eyebrow="Free · 25 minutes" title="Book your free Client Acquisition Review"
      intro="A focused 25 minutes on your goals, what’s working, what’s holding you back, and your biggest opportunity to grow."
      steps={["Tell me about your business (about 2 minutes).", "Message Dr. Dan on WhatsApp to arrange your free review.", "Show up. We’ll find what’s in the way."]}>
      {submitted ? <div className="py-4 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" aria-hidden="true" />
        <h2 ref={confirmation} tabIndex={-1} className="mt-5 font-display text-2xl font-bold outline-none">Your enquiry has been submitted.</h2>
        <p className="mt-3 text-muted-foreground">Your details are saved. Next, message Dr. Dan on WhatsApp to arrange your free 25-minute Client Acquisition Review.</p>
        <p className="mt-3 text-sm text-muted-foreground">Your appointment is not confirmed yet. You’ll agree on a time with Dr. Dan on WhatsApp.</p>
        <ExtLink href={LINKS.whatsapp} className="mt-6 w-full" onClick={() => window.__lovableEvents?.track?.("project.consultation_whatsapp_clicked", { session: "free_review" })}>Continue to WhatsApp<ArrowUpRight className="h-4 w-4" /></ExtLink>
      </div> : (
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          const who = await save(e.currentTarget);
          if (who) setSubmitted(true);
        }}>
          <div className="form-contact grid gap-5 sm:grid-cols-2">
          <F label="Full name"><input name="name" required autoComplete="name" className={field} /></F>
          <F label="Email address"><input name="email" type="email" required autoComplete="email" className={field} /></F>
          <F label="WhatsApp number"><input name="phone" type="tel" required autoComplete="tel" placeholder="+234…" className={field} /></F>
          </div>
          <F label="Business or brand name"><input name="business" required className={field} /></F>
          <F label="What do you sell?"><input name="sell" required className={field} /></F>
          <Options name="target" label="What target are you working toward?" options={TARGETS} placeholder="Select your next target" />
          <StuckPicker grouped label="Where are you getting stuck? (choose as many as apply)" />
          <F label="Anything else I should know? (optional)"><input name="notes" placeholder="One line is enough" className={field} /></F>
          <F label="Website or LinkedIn (optional)"><input name="site" placeholder="https://" className={field} /></F>
          <FormError msg={error} />
          <Button type="submit" disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "SAVING…" : "BOOK MY FREE REVIEW →"}</Button>
          {privacy}
        </form>
      )}
    </FormShell>
  );
}
