import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { DateRangePicker, Delta } from "@/components/admin/date-range-picker";
import { inRange, readRange, previousRange, change, buckets, countIn, fmtRange, type DateRange } from "@/lib/date-range";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { listAudits } from "@/lib/admin.functions";
import { SeverityBadge, DIAGNOSIS_OPTIONS, fmtDate } from "@/components/admin/Severity";
import { PulseChart, EmptyState } from "@/components/admin/pulse-chart";
import { ScanLine, CalendarCheck, Siren, Stethoscope, ArrowUpRight, X } from "lucide-react";

export const Route = createFileRoute("/admin/xray")({
  head: () => ({
    meta: [
      { title: "Completed X-Rays | Sales Doctor Admin" },
      { name: "description", content: "Private review of completed Sales Doctor assessments." },
      { property: "og:title", content: "Completed X-Rays | Sales Doctor Admin" },
      {
        property: "og:description",
        content: "Private review of completed Sales Doctor assessments.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { from?: string | undefined; to?: string | undefined; diag?: string | undefined; sev?: string | undefined; booked?: string | undefined } => {
    const g = (k: string) => (typeof s[k] === "string" && s[k] ? (s[k] as string) : undefined);
    return { from: g("from"), to: g("to"), diag: g("diag"), sev: g("sev"), booked: g("booked") };
  },
  component: AdminList,
});

function AdminList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audits"],
    queryFn: () => listAudits(),
  });
  const [q, setQ] = useState("");
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/xray" });
  const diag = search.diag ?? "", sev = search.sev ?? "", booked = search.booked ?? "";
  const range = readRange(search);
  const setF = (patch: Record<string, string | undefined>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const setDiag = (v: string) => setF({ diag: v || undefined });
  const setSev = (v: string) => setF({ sev: v || undefined });
  const setBooked = (v: string) => setF({ booked: v || undefined });
  const listRef = useRef<HTMLDivElement>(null);
  const drill = (patch: Record<string, string | undefined>) => { setF(patch); requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); };
  const inPeriod = useMemo(() => (data ?? []).filter((r) => inRange(r.completed_at, range)), [data, range.from, range.to]);
  const prevPeriod = useMemo(() => { const pr = previousRange(range); return (data ?? []).filter((r) => inRange(r.completed_at, pr)); }, [data, range.from, range.to]);

  const rows = useMemo(
    () =>
      inPeriod.filter((r) => {
        const t = q.trim().toLowerCase();
        if (t && !r.name.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t))
          return false;
        if (diag && r.primary_diagnosis !== diag) return false;
        if (sev === "URGENT" ? r.severity !== "HIGH" && r.severity !== "CRITICAL" : sev && r.severity !== sev) return false;
        if (booked && String(r.booked) !== booked) return false;
        return true;
      }),
    [inPeriod, q, diag, sev, booked],
  );

  const sel = "field w-full sm:!w-auto !py-2 text-sm min-h-11";
  return (
    <div className="admin-page">
      <div className="mb-6"><p className="eyebrow">Client X-Ray · Admin</p><h1 className="mt-4 font-display text-4xl font-extrabold">Completed X-Rays</h1></div>
      <div className="mb-6"><DateRangePicker value={range} onChange={(r) => setF(r)} /><p className="mt-2 text-xs text-muted-foreground">Showing {fmtRange(range)}, compared with {fmtRange(previousRange(range))}.</p></div>
      {!isLoading && !isError && <XrayScan rows={inPeriod} prev={prevPeriod} hasAny={!!data?.length} range={range} onDrill={drill} />}
      <div ref={listRef} className="admin-filter-grid scroll-mt-24">
        <input
          aria-label="Search name or email"
          placeholder="Search name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="field !py-2 text-sm sm:!w-72"
        />
        <select
          value={diag}
          onChange={(e) => setDiag(e.target.value)}
          className={sel}
          aria-label="Diagnosis"
        >
          <option value="">All diagnoses</option>
          {DIAGNOSIS_OPTIONS.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
        <select
          value={sev}
          onChange={(e) => setSev(e.target.value)}
          className={sel}
          aria-label="Severity"
        >
          <option value="">All severities</option>
          <option value="URGENT">High or critical</option>
          {["LOW", "MODERATE", "HIGH", "CRITICAL"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={booked}
          onChange={(e) => setBooked(e.target.value)}
          className={sel}
          aria-label="Booked"
        >
          <option value="">Booked & not booked</option>
          <option value="true">Booked</option>
          <option value="false">Not booked</option>
        </select>
        <span className="text-sm text-muted-foreground"><strong className="text-foreground">{rows.length}</strong> shown</span>
        {(diag || sev || booked) && <button type="button" onClick={() => setF({ diag: undefined, sev: undefined, booked: undefined })} className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-primary hover:bg-muted"><X className="h-4 w-4" />Clear filters</button>}
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
        {isLoading ? (
          <p role="status" className="p-8 text-center text-muted-foreground">
            Loading…
          </p>
        ) : isError ? (
          <p role="alert" className="p-8 text-center text-destructive">
            Couldn't load X-Rays. Please refresh.
          </p>
        ) : !data?.length ? (
          <p className="p-10 text-center font-display text-lg text-primary">
            No completed X-Rays yet.
          </p>
        ) : !rows.length ? (
          <p className="p-8 text-center text-muted-foreground">No X-Rays match these filters in this period.</p>
        ) : (
          <>
            <ul className="divide-y divide-border sm:hidden">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    to="/admin/$id"
                    params={{ id: r.id }}
                    className="block w-full px-4 py-4 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-medium text-foreground">{r.name}</span>
                      <SeverityBadge value={r.severity} />
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{r.email}</p>
                    <p className="mt-2 text-sm font-medium text-primary">{r.diagnosis_title}</p>
                    <p className="mt-1 truncate text-sm text-foreground">{r.sells || "-"}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {fmtDate(r.completed_at)} · Booked: {r.booked ? "Yes" : "No"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-secondary/30 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <tr>
                    {[
                      "Name",
                      "Email",
                      "What they sell",
                      "Primary diagnosis",
                      "Severity",
                      "Date",
                      "Booked",
                    ].map((h) => (
                      <th key={h} className="px-4 py-3 font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className=" border-t border-border hover:bg-secondary/20">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <Link
                          to="/admin/$id"
                          params={{ id: r.id }}
                          className="inline-flex min-h-11 items-center text-primary underline underline-offset-4"
                        >
                          {r.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{r.email}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-foreground">
                        {r.sells || "-"}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary">{r.diagnosis_title}</td>
                      <td className="px-4 py-3">
                        <SeverityBadge value={r.severity} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {fmtDate(r.completed_at)}
                      </td>
                      <td className="px-4 py-3">{r.booked ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type Row = { completed_at: string | null; primary_diagnosis: string | null; severity: string | null; booked: boolean | null };
function XrayScan({ rows, prev, hasAny, range, onDrill }: { rows: Row[]; prev: Row[]; hasAny: boolean; range: DateRange; onDrill: (p: Record<string, string | undefined>) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  if (!hasAny) return <div className="xray-scan mb-8"><EmptyState icon={ScanLine} title="No X-Ray scans yet" body="Diagnosis trends, severity mix and booking rate appear after the first completed X-Ray." /></div>;
  const bs = buckets(range);
  const trend = countIn(rows.map((r) => r.completed_at), bs);
  const booked = rows.filter((r) => r.booked).length, pBooked = prev.filter((r) => r.booked).length;
  const urgentOf = (xs: Row[]) => xs.filter((r) => r.severity === "HIGH" || r.severity === "CRITICAL").length;
  const urgent = urgentOf(rows);
  const diag = DIAGNOSIS_OPTIONS.map(([k, l]) => [k, l, rows.filter((r) => r.primary_diagnosis === k).length, prev.filter((r) => r.primary_diagnosis === k).length] as const).sort((a, b) => b[2] - a[2]);
  const topN = diag[0]?.[2] ?? 0;
  const sevs = ["LOW", "MODERATE", "HIGH", "CRITICAL"].map((s) => [s, rows.filter((r) => r.severity === s).length] as const);
  const rateNow = rows.length ? Math.round((booked / rows.length) * 100) : null, ratePrev = prev.length ? Math.round((pBooked / prev.length) * 100) : null;
  const b = sel != null ? bs[sel] : undefined;
  return <section className="xray-scan mb-8 space-y-5">
    <div className="dash-stats grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <ScanStat icon={ScanLine} n={rows.length} label="Completed X-Rays" delta={change(rows.length, prev.length)} accent onClick={() => onDrill({ diag: undefined, sev: undefined, booked: undefined })} />
      <ScanStat icon={CalendarCheck} n={rateNow == null ? "-" : `${rateNow}%`} label={`Booked a call · ${booked} of ${rows.length}`} sub={ratePrev == null ? undefined : `was ${ratePrev}%`} onClick={() => onDrill({ booked: "true" })} />
      <ScanStat icon={Siren} n={urgent} label="High or critical severity" delta={change(urgent, urgentOf(prev))} onClick={() => onDrill({ sev: "URGENT" })} />
      <ScanStat icon={Stethoscope} n={topN ? diag[0]![1].replace("The ", "") : "-"} label="Most common diagnosis" small onClick={topN ? () => onDrill({ diag: diag[0]![0] }) : undefined} />
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="dashboard-distribution"><div className="flex items-center justify-between border-b border-border pb-4"><span className="font-semibold">Scans in this period</span><span className="flex items-center gap-2"><Delta pct={change(rows.length, prev.length)} /><span className="font-display text-2xl font-extrabold tabular-nums">{rows.length}</span></span></div>
        <div className="mt-4">{trend.some(Boolean) ? <>
          <PulseChart labels={bs.map((x) => x.label)} selected={sel} onSelect={setSel} series={[{ name: "X-Rays", values: trend, tone: "primary" }]} />
          {b ? <div className="drill-panel"><strong>{fmtRange(b)}</strong><button type="button" className="drill-link" onClick={() => onDrill({ from: b.from, to: b.to })}>Open {trend[sel!]} X-Rays <ArrowUpRight className="h-3.5 w-3.5" /></button></div>
            : <p className="mt-3 text-xs text-muted-foreground">Tap a point on the line to open that day's X-Rays.</p>}
        </> : <EmptyState icon={ScanLine} title="Quiet period" body="No X-Rays were completed in this date range." />}</div></div>
      <div className="dashboard-distribution"><p className="border-b border-border pb-4 font-semibold">Severity mix</p>
        <div className="severity-bar mt-5" aria-hidden="true">{sevs.map(([s, n]) => n ? <span key={s} className={`sev-${s}`} style={{ flexGrow: n }} /> : null)}</div>
        <ul className="mt-4 grid grid-cols-2 gap-1 text-sm">{sevs.map(([s, n]) => <li key={s}><button type="button" onClick={() => onDrill({ sev: s })} className="drill-row flex min-h-11 w-full items-center gap-2 text-left"><span className={`sev-dot sev-${s}`} />{s.charAt(0) + s.slice(1).toLowerCase()}<strong className="ml-auto tabular-nums">{n}</strong></button></li>)}</ul>
      </div>
    </div>
    <div className="dashboard-distribution"><p className="border-b border-border pb-4 font-semibold">Diagnosis ranking <span className="ml-1 text-xs font-normal text-muted-foreground">Tap a diagnosis to see those clients</span></p>
      <ol className="mt-3 space-y-1">{diag.map(([k, l, n, pn], i) => <li key={k}><button type="button" onClick={() => onDrill({ diag: k })} className="drill-row block w-full text-left"><div className="mb-1.5 flex items-center justify-between gap-3 text-sm"><span><span className="mr-2 font-display text-xs font-bold text-primary">0{i + 1}</span>{l}</span><span className="flex items-center gap-2"><Delta pct={change(n, pn)} /><strong className="tabular-nums">{n}</strong><ArrowUpRight className="h-3.5 w-3.5 opacity-50" /></span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${topN ? (n / topN) * 100 : 0}%`, opacity: 1 - i * 0.12 }} /></div></button></li>)}</ol>
    </div>
  </section>;
}
function ScanStat({ icon: Icon, n, label, sub, delta, accent, small, onClick }: { icon: typeof ScanLine; n: number | string; label: string; sub?: string | undefined; delta?: number | null; accent?: boolean; small?: boolean; onClick?: (() => void) | undefined }) {
  return <button type="button" disabled={!onClick} onClick={onClick} className={`dashboard-stat w-full text-left ${accent ? "dashboard-stat-accent" : ""}`}><span className="flex items-center justify-between gap-2"><span className="dashboard-stat-icon"><Icon className="h-5 w-5" /></span>{delta !== undefined && <Delta pct={delta} light={accent} />}</span><p className={`mt-6 font-display font-extrabold tabular-nums ${small ? "text-xl leading-tight sm:text-2xl" : "text-4xl"}`}>{n}</p><p className="mt-2 text-sm font-medium leading-snug opacity-80">{label}</p>{sub && <p className="mt-1 text-xs opacity-70">{sub}</p>}</button>;
}
