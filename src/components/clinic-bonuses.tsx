import { FileCheck, CalendarDays, Send, ClipboardPen, MessageCircle, Gift, Check } from "lucide-react";
import { CLINIC_BONUSES, CLINIC_BONUS_VALUE } from "@/lib/clinic-bonuses";
import { CLINIC_PRICE } from "@/lib/links";

const ICONS = [FileCheck, CalendarDays, Send, ClipboardPen, MessageCircle];

export function ClinicBonuses() {
  return <section aria-labelledby="clinic-bonuses-title" className="mt-9 border-y border-border py-8 md:py-10">
    <p className="eyebrow text-primary"><Gift aria-hidden="true" className="h-4 w-4" />5 free bonuses</p>
    <h2 id="clinic-bonuses-title" className="mt-3 font-display text-2xl font-bold md:text-3xl">90-minute working session + 5 bonuses</h2>
    <p className="mt-3 text-muted-foreground">When you book today, you also get:</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {CLINIC_BONUSES.map((bonus, index) => {
        const Icon = ICONS[index] ?? Gift;
        return <article key={bonus.title} className={`rounded-lg border border-border p-5 ${index === 4 ? "bg-ink text-ink-foreground sm:col-span-2" : "bg-card"}`}>
          <div className="flex items-center justify-between gap-3"><span className={`text-xs font-bold uppercase ${index === 4 ? "text-ink-foreground/70" : "text-primary"}`}>Bonus {index + 1}</span><Icon aria-hidden="true" className="h-5 w-5 shrink-0" /></div>
          <h3 className="mt-3 font-display text-lg font-bold leading-snug">{bonus.title}</h3>
          <p className={`mt-3 text-sm leading-relaxed ${index === 4 ? "text-ink-foreground/80" : "text-muted-foreground"}`}>{bonus.description}</p>
          <p className={`mt-4 border-t pt-3 text-xs font-semibold ${index === 4 ? "border-ink-foreground/20" : "border-border text-primary"}`}>{bonus.price === null ? "Normally reserved for VIP clients only" : `Sold separately: $${bonus.price}`}</p>
        </article>;
      })}
    </div>
    <div className="mt-6 border-l-2 border-primary pl-4">
      <p className="text-sm text-muted-foreground">Total bonus value: <strong className="text-foreground">${CLINIC_BONUS_VALUE} + VIP-only access</strong></p>
      <p className="mt-2 font-display text-lg font-bold">Your price: {CLINIC_PRICE} for the session, all bonuses included</p>
      <p className="mt-2 flex items-center gap-2 text-sm text-primary"><Check aria-hidden="true" className="h-4 w-4 shrink-0" />All 5 bonuses included</p>
    </div>
  </section>;
}