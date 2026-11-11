import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { F, FormError, FormShell, Options, StuckPicker, field, privacy, useEnquiry } from "@/components/form-bits";
import { btnClass } from "@/components/site";
import { CLINIC_PRICE, CLINIC_TERMS, LINKS, REVENUE, TARGETS } from "@/lib/links";
import { PaidDialog } from "@/components/paid-dialog";
import { Button } from "@/components/ui/button";
import { ClinicBonuses } from "@/components/clinic-bonuses";
import { CalendarCheck, Clock, CreditCard, ExternalLink, Landmark, Lock, Receipt, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/book/clinic")({
  head: () => ({
    meta: [
      { title: "Book your Private Sales Clinic | The Sales Clinic" },
      { name: "description", content: "A $53, 90-minute working session with Dr. Dan, including five free bonuses worth $27 plus VIP-only access." },
      { property: "og:title", content: "Private Sales Clinic | The Sales Clinic" },
      { property: "og:description", content: "Book a $53 Private Sales Clinic: 90 minutes with Dr. Dan and all five bonuses included." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Clinic,
});

function Clinic() {
  const [who, setWho] = useState<{ name: string; email: string } | null>(null);
  const { save, busy, error } = useEnquiry("private_clinic");
  const navigate = useNavigate();
  return (
    <FormShell eyebrow={`Private Sales Clinic · ${CLINIC_PRICE}`} title="Book your Private Sales Clinic"
      introduction={<ClinicBonuses />}
      intro="A deep working session on your numbers, your process and your target. We don’t just find the gap. We work out how to close it."
      steps={["Share your goals and where you are now.", "Confirm payment and choose your 90-minute slot.", "We work through it together. You leave with a plan."]}>
      {who ? (
        <div className="checkout">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow">Step 2 of 3</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary"><ShieldCheck className="h-3.5 w-3.5" /> Secure checkout</span>
          </div>
          <h2 className="mt-3 text-2xl font-extrabold md:text-3xl">Confirm your payment of {CLINIC_PRICE}</h2>
          <p className="mt-2 text-muted-foreground">Choose how you’d like to pay. The payment page opens in a new tab.</p>

          {/* Order summary — receipt style */}
          <div className="checkout-receipt mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Order summary</p>
                <p className="mt-2 font-display text-lg font-extrabold">Private Sales Clinic</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="h-3.5 w-3.5" /> 90 min · with Dr. Dan</p>
                <p className="mt-2 text-sm font-semibold text-primary">All 5 free bonuses included</p>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground"><Receipt className="h-5 w-5" /></span>
            </div>
            <div className="checkout-perforation" aria-hidden="true" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Billed to</dt><dd className="max-w-[60%] truncate font-medium">{who.name}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Email</dt><dd className="max-w-[60%] truncate font-medium">{who.email}</dd></div>
            </dl>
            <div className="mt-4 flex items-end justify-between border-t border-dashed border-border pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-right"><strong className="font-display text-3xl font-black">{CLINIC_PRICE}</strong><br /><span className="text-xs text-muted-foreground">{CLINIC_TERMS}</span></span>
            </div>
          </div>

          {/* Payment methods */}
          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment method</p>
          <div className="mt-3 grid gap-3">
            <a href={LINKS.stripe} target="_blank" rel="noopener noreferrer" className="pay-method group" onClick={() => window.__lovableEvents?.track?.("project.payment_started", { provider: "stripe" })}>
              <span className="pay-logo bg-primary text-primary-foreground"><CreditCard className="h-5 w-5" /></span>
              <span className="flex-1"><span className="block font-bold">PAY IN USD · STRIPE</span><span className="block text-xs text-muted-foreground">Opens Stripe secure checkout</span></span>
              <span className="pay-currency">USD</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
            </a>
            <a href={LINKS.flutterwave} target="_blank" rel="noopener noreferrer" className="pay-method group" onClick={() => window.__lovableEvents?.track?.("project.payment_started", { provider: "flutterwave" })}>
              <span className="pay-logo bg-ink text-ink-foreground"><Landmark className="h-5 w-5" /></span>
              <span className="flex-1"><span className="block font-bold">PAY IN NGN · FLUTTERWAVE</span><span className="block text-xs text-muted-foreground">Opens Flutterwave secure checkout</span></span>
              <span className="pay-currency">NGN</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" aria-hidden="true" />
            </a>
          </div>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Payments are processed securely by Stripe or Flutterwave. We never see your card details.</p>

          <div className="checkout-next mt-8">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card text-primary"><CalendarCheck className="h-5 w-5" /></span>
            <div className="flex-1">
              <p className="font-semibold">Paid? Choose your 90-minute slot.</p>
            </div>
          </div>
          <PaidDialog who={who} onDone={() => navigate({ to: "/book/schedule", search: { session: "clinic", name: who.name, email: who.email } })} />
        </div>
      ) : (
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          const w = await save(e.currentTarget);
          if (w) { setWho(w); window.scrollTo({ top: 0, behavior: "smooth" }); }
        }}>
          <div className="form-contact grid gap-5 sm:grid-cols-2">
          <F compact label="Full name"><input name="name" required autoComplete="name" className={field} /></F>
          <F compact label="Email address"><input name="email" type="email" required autoComplete="email" className={field} /></F>
          <F compact label="WhatsApp number"><input name="phone" type="tel" required autoComplete="tel" placeholder="+234…" className={field} /></F>
          </div>
          <F compact label="Business or brand name"><input name="business" required className={field} /></F>
          <F compact label="What do you sell, and who do you sell it to?"><input name="sell" required className={field} /></F>
          <Options compact name="revenue" label="Current monthly revenue" options={REVENUE} placeholder="Select a range" />
          <Options compact name="target" label="Your next target" options={TARGETS} placeholder="Select your next target" />
          <StuckPicker grouped label="What would you like to work through? (choose as many as apply)" />
          <F compact label="Anything else I should know? (optional)"><input name="notes" placeholder="One line is enough" className={field} /></F>
          <div className="flex items-center justify-between rounded-lg bg-ink p-4 text-ink-foreground">
            <span className="font-semibold">Private Sales Clinic · 90 min<span className="mt-1 block text-xs font-normal opacity-80">All 5 free bonuses included</span></span>
            <span className="text-right text-sm"><strong className="font-display text-xl">{CLINIC_PRICE}</strong><br /><span className="opacity-70">{CLINIC_TERMS}</span></span>
          </div>
          <FormError msg={error} />
          <Button type="submit" disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "SAVING…" : "CONTINUE TO PAYMENT →"}</Button>
          {privacy}
        </form>
      )}
    </FormShell>
  );
}
