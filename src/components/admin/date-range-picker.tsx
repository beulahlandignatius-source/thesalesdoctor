import { CalendarRange } from "lucide-react";
import { PRESETS, matchesPreset, presetRange, type DateRange, type Preset } from "@/lib/date-range";
import { Button } from "@/components/ui/button";

/** Preset chips plus custom from/to dates. Every admin dashboard uses the same control. */
export function DateRangePicker({ value, onChange }: { value: DateRange; onChange: (r: DateRange) => void }) {
  const active = matchesPreset(value);
  return (
    <div className="date-range" role="group" aria-label="Date range">
      <label className="date-range-preset"><span className="sr-only">Period</span><select aria-label="Period" value={active ?? "custom"} onChange={(e) => { if (e.target.value !== "custom") onChange(presetRange(e.target.value as Preset)); }}>{PRESETS.map(([p, label]) => <option key={p} value={p}>{label}</option>)}<option value="custom">Custom dates</option></select></label>
      <div className="date-range-chips">
        {PRESETS.map(([p, label]) => (
          <Button key={p} variant="ghost" type="button" aria-pressed={active === p} className="date-chip" onClick={() => onChange(presetRange(p))}>{label}</Button>
        ))}
      </div>
      <div className="date-range-custom">
        <CalendarRange className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <label className="sr-only" htmlFor="range-from">From</label>
        <input id="range-from" type="date" value={value.from} max={value.to} onChange={(e) => e.target.value && onChange({ ...value, from: e.target.value })} />
        <span aria-hidden="true" className="text-muted-foreground">to</span>
        <label className="sr-only" htmlFor="range-to">To</label>
        <input id="range-to" type="date" value={value.to} min={value.from} onChange={(e) => e.target.value && onChange({ ...value, to: e.target.value })} />
      </div>
    </div>
  );
}

/** Small "+12% vs previous period" tag. */
export function Delta({ pct, light }: { pct: number | null; light?: boolean | undefined }) {
  if (pct === 0) return null;
  if (pct == null) return <span className={`delta delta-flat ${light ? "delta-light" : ""}`}>New</span>;
  return <span className={`delta ${pct > 0 ? "delta-up" : pct < 0 ? "delta-down" : "delta-flat"} ${light ? "delta-light" : ""}`}>{pct > 0 ? "+" : ""}{pct}%</span>;
}
