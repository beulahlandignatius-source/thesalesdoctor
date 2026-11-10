import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { F, FormError, FormShell, Options, StuckPicker, field, privacy, useEnquiry } from "@/components/form-bits";
import { ExtLink, btnClass } from "@/components/site";
import { CLINIC_PRICE, CLINIC_TERMS, LINKS, REVENUE, TARGETS, calendlyUrl } from "@/lib/links";

export const Route = createFileRoute("/book/clinic")({
  head: () => ({
    meta: [
      { title: "Book your Private Sales Clinic — The Sales Clinic" },
      { name: "description", content: "A 90-minute deep working session with Dr. Dan on your numbers, your process and your target." },
      { property: "og:title", content: "Private Sales Clinic — The Sales Clinic" },
      { property: "og:description", content: "We don’t just find the gap. We work out how to close it." },
    ],
  }),
  component: Clinic,
});

function Clinic() {
  const [who, setWho] = useState<{ name: string; email: string } | null>(null);
  const { save, busy, error } = useEnquiry("private_clinic");
  return (
    <FormShell eyebrow="Private Sales Clinic · 90 minutes" title="Book your Private Sales Clinic"
      intro="A deep working session on your numbers, your process and your target. We don’t just find the gap. We work out how to close it."
      steps={["Share your goals and where you are now.", "Confirm payment and choose your 90-minute slot.", "We work through it together. You leave with a plan."]}>
      {who ? (
        <div>
          <p className="eyebrow">Step 2 of 3</p>
          <h2 className="mt-2 text-2xl font-extrabold">Confirm your payment of {CLINIC_PRICE}</h2>
          <p className="mt-2 text-muted-foreground">Choose how you’d like to pay. The payment page opens in a new tab.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ExtLink href={LINKS.stripe} onClick={() => window.__lovableEvents?.track?.("project.payment_started", { provider: "stripe" })}>PAY IN USD · STRIPE</ExtLink>
            <ExtLink href={LINKS.flutterwave} variant="dark" onClick={() => window.__lovableEvents?.track?.("project.payment_started", { provider: "flutterwave" })}>PAY IN NGN · FLUTTERWAVE</ExtLink>
          </div>
          <div className="mt-8 rounded-lg bg-blush p-5">
            <p className="font-semibold">Paid? Choose your 90-minute slot.</p>
            <ExtLink href={calendlyUrl(who.name, who.email)} variant="outline" className="mt-4 w-full" onClick={() => window.__lovableEvents?.track?.("project.consultation_booking_opened", { session: "private_clinic" })}>CHOOSE MY SLOT ON CALENDLY →</ExtLink>
          </div>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          const w = await save(e.currentTarget);
          if (w) { setWho(w); window.scrollTo({ top: 0, behavior: "smooth" }); }
        }}>
          <F label="Full name"><input name="name" required className={field} /></F>
          <F label="Email address"><input name="email" type="email" required className={field} /></F>
          <F label="WhatsApp number"><input name="phone" type="tel" required placeholder="+234…" className={field} /></F>
          <F label="Business or brand name"><input name="business" required className={field} /></F>
          <F label="What do you sell, and who do you sell it to?"><input name="sell" required className={field} /></F>
          <Options name="revenue" label="Current monthly revenue" options={REVENUE} placeholder="Select a range" />
          <Options name="target" label="Your next target" options={TARGETS} placeholder="Select your next target" />
          <StuckPicker label="What would you like to work through? (choose as many as apply)" />
          <F label="Anything else I should know? (optional)"><input name="notes" placeholder="One line is enough" className={field} /></F>
          <div className="flex items-center justify-between rounded-lg bg-ink p-4 text-ink-foreground">
            <span className="font-semibold">Private Sales Clinic · 90 min</span>
            <span className="text-right text-sm"><strong className="font-display text-xl">{CLINIC_PRICE}</strong><br /><span className="opacity-70">{CLINIC_TERMS}</span></span>
          </div>
          <FormError msg={error} />
          <button type="submit" disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "SAVING…" : "CONTINUE TO PAYMENT →"}</button>
          {privacy}
        </form>
      )}
    </FormShell>
  );
}
