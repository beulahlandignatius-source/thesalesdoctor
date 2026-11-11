import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CALL_PURPOSES, type CallPurpose } from "@/lib/xray-booking";

export function XrayCallPurpose() {
  const [purpose, setPurpose] = useState<CallPurpose | undefined>();
  return <div className="mt-5">
    <fieldset>
      <legend className="font-display text-lg font-semibold">What’s the purpose of your call?</legend>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {CALL_PURPOSES.map(item => <label key={item.value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${purpose === item.value ? "border-primary bg-secondary" : "border-border bg-background"}`}>
          <input type="radio" name="call-purpose" value={item.value} checked={purpose === item.value} onChange={() => setPurpose(item.value)} className="h-5 w-5 shrink-0 accent-primary" />
          <span className="text-sm font-medium">{item.label}</span>
        </label>)}
      </div>
    </fieldset>
    {purpose ? <Button asChild variant="premium" size="lg" className="mt-5"><Link to="/xray/book" search={{ purpose }}>Continue to Calendly <ArrowRight /></Link></Button> : <Button variant="premium" size="lg" disabled className="mt-5">Continue to Calendly <ArrowRight /></Button>}
  </div>;
}