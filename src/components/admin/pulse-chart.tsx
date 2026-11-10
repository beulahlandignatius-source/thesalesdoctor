import type React from "react";
/** ECG-style trend chart: one or two daily series drawn as heartbeat lines. */
export function PulseChart({ series, labels }: { series: { name: string; values: number[]; tone: "primary" | "soft" }[]; labels: string[] }) {
  const W = 600, H = 160, pad = 12;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const n = labels.length;
  const pt = (v: number, i: number) => [pad + (i * (W - pad * 2)) / Math.max(1, n - 1), H - pad - (v / max) * (H - pad * 2)] as const;
  const path = (vals: number[]) => vals.map((v, i) => { const [x, y] = pt(v, i); return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
  return <figure>
    <svg viewBox={`0 0 ${W} ${H}`} className="pulse-chart h-40 w-full" role="img" aria-label={series.map((s) => `${s.name}: ${s.values.reduce((a, b) => a + b, 0)} in ${n} days`).join(", ")}>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={pad} x2={W - pad} y1={pad + f * (H - pad * 2)} y2={pad + f * (H - pad * 2)} className="pulse-grid" />)}
      {series.map((s) => <g key={s.name} className={`pulse-series pulse-${s.tone}`}>
        <path d={`${path(s.values)} L${W - pad} ${H - pad} L${pad} ${H - pad} Z`} className="pulse-area" />
        <path d={path(s.values)} className="pulse-stroke" pathLength={1} />
        {s.values.map((v, i) => v > 0 ? <circle key={i} cx={pt(v, i)[0]} cy={pt(v, i)[1]} r={3.5} className="pulse-dot" /> : null)}
      </g>)}
    </svg>
    <figcaption className="mt-2 flex justify-between text-[11px] text-muted-foreground"><span>{labels[0]}</span><span>{labels[n - 1]}</span></figcaption>
  </figure>;
}

export function EmptyState({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return <div className="dash-empty"><span className="dash-empty-icon"><Icon className="h-6 w-6" /></span><p className="mt-4 font-semibold">{title}</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p></div>;
}

export const lastDays = (n: number) => Array.from({ length: n }, (_, i) => { const d = new Date(); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() - (n - 1 - i)); return d; });
export const dayKey = (d: Date | string) => new Date(d).toISOString().slice(0, 10);
export const dayLabel = (d: Date) => d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
export const bucket = (dates: (string | null)[], days: Date[]) => { const m = new Map(days.map((d) => [dayKey(d), 0])); for (const x of dates) { if (!x) continue; const k = dayKey(x); if (m.has(k)) m.set(k, m.get(k)! + 1); } return days.map((d) => m.get(dayKey(d)) ?? 0); };
