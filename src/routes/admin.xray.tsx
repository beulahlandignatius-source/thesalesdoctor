import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { listAudits } from "@/lib/admin.functions";
import { SeverityBadge, DIAGNOSIS_OPTIONS, fmtDate } from "@/components/admin/Severity";
import { PulseChart, EmptyState, lastDays, bucket, dayLabel } from "@/components/admin/pulse-chart";
import { ScanLine, CalendarCheck, Siren, Stethoscope } from "lucide-react";

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
  component: AdminList,
});

function AdminList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-audits"],
    queryFn: () => listAudits(),
  });
  const [q, setQ] = useState("");
  const [diag, setDiag] = useState("");
  const [sev, setSev] = useState("");
  const [booked, setBooked] = useState("");

  const rows = useMemo(
    () =>
      (data ?? []).filter((r) => {
        const t = q.trim().toLowerCase();
        if (t && !r.name.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t))
          return false;
        if (diag && r.primary_diagnosis !== diag) return false;
        if (sev && r.severity !== sev) return false;
        if (booked && String(r.booked) !== booked) return false;
        return true;
      }),
    [data, q, diag, sev, booked],
  );

  const sel = "field w-full sm:!w-auto !py-2 text-sm min-h-11";
  return (
    <div>
      <div className="mb-6"><p className="eyebrow">Client X-Ray · Admin</p><h1 className="mt-4 font-display text-4xl font-extrabold">Completed X-Rays</h1></div>
      {!isLoading && !isError && <XrayScan rows={data ?? []} />}
      <div className="flex flex-wrap gap-3">
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
          <p className="p-8 text-center text-muted-foreground">No X-Rays match these filters.</p>
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
function XrayScan({ rows }: { rows: Row[] }) {
  if (!rows.length) return <div className="xray-scan mb-8"><EmptyState icon={ScanLine} title="No X-Ray scans yet" body="Diagnosis trends, severity mix and booking rate appear after the first completed X-Ray." /></div>;
  const days = lastDays(30);
  const trend = bucket(rows.map((r) => r.completed_at), days);
  const booked = rows.filter((r) => r.booked).length;
  const urgent = rows.filter((r) => r.severity === "HIGH" || r.severity === "CRITICAL").length;
  const diag = DIAGNOSIS_OPTIONS.map(([k, l]) => [l, rows.filter((r) => r.primary_diagnosis === k).length] as const).sort((a, b) => b[1] - a[1]);
  const topN = diag[0]?.[1] ?? 0;
  const sevs = ["LOW", "MODERATE", "HIGH", "CRITICAL"].map((s) => [s, rows.filter((r) => r.severity === s).length] as const);
  return <section className="xray-scan mb-8 space-y-5">
    <div className="dash-stats grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <ScanStat icon={ScanLine} n={rows.length} label="Completed X-Rays" accent />
      <ScanStat icon={CalendarCheck} n={`${Math.round((booked / rows.length) * 100)}%`} label={`Booked a call · ${booked} of ${rows.length}`} />
      <ScanStat icon={Siren} n={urgent} label="High or critical severity" />
      <ScanStat icon={Stethoscope} n={topN ? diag[0]![0].replace("The ", "") : "-"} label="Most common diagnosis" small />
    </div>
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="dashboard-distribution"><div className="flex items-center justify-between border-b border-border pb-4"><span className="font-semibold">Scans in the last 30 days</span><span className="font-display text-2xl font-extrabold tabular-nums">{trend.reduce((a, b) => a + b, 0)}</span></div>
        <div className="mt-4">{trend.some(Boolean) ? <PulseChart labels={days.map(dayLabel)} series={[{ name: "X-Rays", values: trend, tone: "primary" }]} /> : <EmptyState icon={ScanLine} title="Quiet month" body="No X-Rays were completed in the last 30 days." />}</div></div>
      <div className="dashboard-distribution"><p className="border-b border-border pb-4 font-semibold">Severity mix</p>
        <div className="severity-bar mt-5" aria-hidden="true">{sevs.map(([s, n]) => n ? <span key={s} className={`sev-${s}`} style={{ flexGrow: n }} /> : null)}</div>
        <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">{sevs.map(([s, n]) => <li key={s} className="flex items-center gap-2"><span className={`sev-dot sev-${s}`} />{s.charAt(0) + s.slice(1).toLowerCase()}<strong className="ml-auto tabular-nums">{n}</strong></li>)}</ul>
      </div>
    </div>
    <div className="dashboard-distribution"><p className="border-b border-border pb-4 font-semibold">Diagnosis ranking</p>
      <ol className="mt-5 space-y-4">{diag.map(([l, n], i) => <li key={l}><div className="mb-1.5 flex justify-between gap-3 text-sm"><span><span className="mr-2 font-display text-xs font-bold text-primary">0{i + 1}</span>{l}</span><strong className="tabular-nums">{n}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${topN ? (n / topN) * 100 : 0}%`, opacity: 1 - i * 0.12 }} /></div></li>)}</ol>
    </div>
  </section>;
}
function ScanStat({ icon: Icon, n, label, accent, small }: { icon: typeof ScanLine; n: number | string; label: string; accent?: boolean; small?: boolean }) {
  return <div className={`dashboard-stat ${accent ? "dashboard-stat-accent" : ""}`}><span className="dashboard-stat-icon"><Icon className="h-5 w-5" /></span><p className={`mt-6 font-display font-extrabold tabular-nums ${small ? "text-2xl leading-tight" : "text-4xl"}`}>{n}</p><p className="mt-2 text-sm opacity-75">{label}</p></div>;
}
