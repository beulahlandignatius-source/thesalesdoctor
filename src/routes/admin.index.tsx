import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DateRangePicker, Delta } from "@/components/admin/date-range-picker";
import { readRange, previousRange, change, inRange, buckets, countIn, fmtRange, type DateRange } from "@/lib/date-range";
import { adminOverview } from "@/lib/enquiries.functions";
import { KIND_LABEL, fmt } from "@/components/admin/enquiry-labels";
import { adminReviews } from "@/lib/reviews.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { PulseChart, EmptyState } from "@/components/admin/pulse-chart";
import { Inbox, ScanLine, Star, CalendarCheck, ArrowUpRight, RefreshCw, ClipboardList, Users, CircleCheck, CreditCard, Activity, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Overview | Sales Admin" },
      { name: "description", content: "Private overview of Sales Clinic enquiries and Client X-Rays." },
      { property: "og:title", content: "Overview | Sales Admin" },
      { property: "og:description", content: "Private admin overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): { from?: string | undefined; to?: string | undefined } => ({ from: typeof s["from"] === "string" ? s["from"] : undefined, to: typeof s["to"] === "string" ? s["to"] : undefined }),
  component: Overview,
});

function Overview() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/" });
  const range = readRange(search);
  const prevR = previousRange(range);
  const setRange = (r: DateRange) => navigate({ search: r, replace: true });
  const load = useServerFn(adminOverview);
  const loadReviews = useServerFn(adminReviews);
  const overview = useQuery({ queryKey: ["admin-overview", range.from, range.to], queryFn: () => load({ data: range }), placeholderData: keepPreviousData });
  const reviews = useQuery({ queryKey: ["admin-reviews"], queryFn: () => loadReviews() });
  const { data, isLoading, isError } = overview;
  const top = (
    <div className="admin-page-heading grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0"><p className="eyebrow">The Sales Clinic · Admin</p><h1 className="mt-3 font-display text-4xl font-extrabold">Overview</h1></div>
      <Button variant="outline" size="icon" className="shrink-0 rounded-lg" aria-label="Refresh dashboard" title="Refresh dashboard" disabled={overview.isFetching || reviews.isFetching} onClick={() => { overview.refetch(); reviews.refetch(); }}><RefreshCw className={overview.isFetching ? "animate-spin" : ""} /></Button>
      <div className="col-span-2 min-w-0"><DateRangePicker value={range} onChange={setRange} /><p className="mt-2 text-xs text-muted-foreground">Showing {fmtRange(range)}, compared with {fmtRange(prevR)}.</p></div>
    </div>
  );
  if (isLoading) return <div className="space-y-9">{top}<div role="status" className="grid animate-pulse gap-5 sm:grid-cols-2"><div className="h-36 rounded-3xl bg-muted" /><div className="h-36 rounded-3xl bg-muted" /><span className="sr-only">Loading…</span></div></div>;
  if (isError || !data) return <div className="space-y-9">{top}<div role="alert"><p className="text-destructive">Couldn’t load the overview. Please refresh.</p><Button variant="outline" className="mt-4 rounded-full" onClick={() => overview.refetch()}><RefreshCw />Refresh</Button></div></div>;
  const m = summarise(data, range), p = summarise(data, prevR);
  const pending = reviews.data?.filter((r) => r.status === "pending").length;
  const clinic = [["free_review", "Free reviews", m.free, p.free], ["private_clinic", "Private Clinics", m.clinic, p.clinic], ["mentorship", "Mentorship", m.mentor, p.mentor]] as const;
  return (
    <div className="dashboard-overview space-y-9">
      {top}
      <ClinicPulse data={data} range={range} m={m} p={p} />
      <div className="dash-stats dash-stats-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
        <Stat label="Paid Private Clinics" sub={`Stripe ${m.stripe} · Flutterwave ${m.flw}`} n={m.stripe + m.flw} delta={change(m.stripe + m.flw, p.stripe + p.flw)} icon={CreditCard} to="/admin/payments" accent />
        <Stat label="Sales Clinic enquiries" n={m.total} delta={change(m.total, p.total)} icon={Inbox} to="/admin/enquiries" search={range} />
        <Stat label="New, not yet handled" n={m.newOnes} icon={ClipboardList} to="/admin/enquiries" search={{ ...range, status: "new" }} />
        <Stat label="Completed X-Rays" n={m.xrays} delta={change(m.xrays, p.xrays)} icon={ScanLine} to="/admin/xray" search={range} />
        <Stat label="Awaiting review approval" n={pending ?? "-"} icon={Star} to="/admin/reviews" />
      </div>
      <section>
        <h2 className="mb-5 text-xl font-bold">Bookings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {([["free_review", "Free Client Acquisition Review"], ["private_clinic", "Private Sales Clinic"]] as const).map(([k, label]) => {
            const f = m.funnel[k], pf = p.funnel[k];
            const headRow = <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border pb-4"><span className="flex min-w-0 items-center gap-2 font-semibold"><CalendarCheck className="h-5 w-5 shrink-0 text-primary" />{label}</span><Link to="/admin/enquiries" search={{ ...range, kind: k }} className="flex min-h-11 shrink-0 items-center gap-1 text-xs font-semibold text-primary">Enquiries <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>;
            if (!f.viewed && !f.started && !f.completed) return <div key={k} className="dashboard-distribution">{headRow}<EmptyState icon={CalendarCheck} title="No calendar activity in this period" body="Views, booking starts and completed bookings show here once visitors open the calendar." /></div>;
            return (
              <div key={k} className="dashboard-distribution">
                {headRow}
                <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {([["Calendar views", f.viewed, pf.viewed], ["Booking starts", f.started, pf.started], ["Completed", f.completed, pf.completed]] as const).map(([l, n, pn]) => (
                    <div key={l}><dd className="font-display text-3xl font-extrabold tabular-nums">{n}</dd><dt className="mt-1 text-xs text-muted-foreground">{l}</dt><dd className="mt-1"><Delta pct={change(n, pn)} /></dd></div>
                  ))}
                </dl>
                <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
                  {([["Views to booking starts", f.started, pf.started], ["Views to completed bookings", f.completed, pf.completed]] as const).map(([l, n, pn]) => {
                    const pct = rate(n, f.viewed), prev = rate(pn, pf.viewed);
                    return (
                      <div key={l}>
                        <div className="mb-1.5 flex flex-wrap justify-between gap-x-3"><span className="text-muted-foreground">{l}</span><strong className="tabular-nums">{pct == null ? "No views yet" : `${pct}%`}{prev != null && <span className="ml-2 text-xs font-normal text-muted-foreground">was {prev}%</span>}</strong></div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct ?? 0}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Sales Clinic</h2><Link to="/admin/enquiries" search={range} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">See these enquiries <ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="dashboard-distribution">
            <div className="flex items-center justify-between border-b border-border pb-6"><span className="text-sm text-muted-foreground">Enquiry distribution</span><span className="font-display text-3xl font-extrabold tabular-nums">{m.total}</span></div>
            <div className="mt-4 space-y-2">{clinic.map(([k, label, n, pn], i) => <Link key={k} to="/admin/enquiries" search={{ ...range, kind: k }} className="drill-row block"><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span>{label}</span><span className="flex items-center gap-2"><Delta pct={change(n, pn)} /><strong className="tabular-nums">{n}</strong><ArrowUpRight className="h-3.5 w-3.5 opacity-50" /></span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-ink" : "bg-dashboard-accent"}`} style={{ width: `${m.total ? (n / m.total) * 100 : 0}%` }} /></div></Link>)}</div>
          </div>
        </section>
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Client X-Ray</h2><Link to="/admin/xray" search={range} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">See these X-Rays <ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="dashboard-xray-summary">
            <ScanLine className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <div className="mt-8 flex items-end justify-between gap-4"><Link to="/admin/xray" search={range} className="drill-row block"><p className="font-display text-5xl font-extrabold tabular-nums">{m.xrays}</p><p className="mt-2 text-sm text-muted-foreground">Completed X-Rays</p></Link><Link to="/admin/xray" search={{ ...range, booked: "true" }} className="drill-row block border-l border-border pl-6"><CalendarCheck className="mb-3 h-5 w-5 text-primary" /><p className="text-2xl font-bold tabular-nums">{m.booked}</p><p className="mt-1 text-xs text-muted-foreground">Booked after X-Ray</p></Link></div>
          </div>
        </section>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Latest enquiries</h2><Inbox className="h-5 w-5 text-muted-foreground" /></div>
          <ul className="dashboard-activity divide-y divide-border">
            {data.recent.length === 0 && <li><EmptyState icon={Users} title="No enquiries yet" body="New free review, clinic and mentorship requests land here first." /></li>}
            {data.recent.map((r) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-5"><div className="flex min-w-0 gap-3"><span className="dashboard-avatar">{r.name.slice(0, 1)}</span><div className="min-w-0"><p className="break-words font-semibold">{r.name}</p><p className="mt-1 text-xs text-muted-foreground">{KIND_LABEL[r.kind] ?? r.kind} · {fmt(r.created_at)}</p></div></div><span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold capitalize text-primary">{r.status}</span></li>)}
          </ul>
        </section>
        <section><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Reviews</h2><Star className="h-5 w-5 text-muted-foreground" /></div><div className="dashboard-review-summary">
          <CircleCheck className="h-9 w-9 text-primary" strokeWidth={1.5} /><p className="mt-6 text-3xl font-extrabold tabular-nums">{pending ?? "-"}</p><p className="mt-2 text-sm text-muted-foreground">Awaiting approval</p>
          {reviews.isError && <p role="alert" className="mt-3 text-sm text-destructive">Couldn’t load reviews.</p>}
          <Button asChild variant="outline" className="mt-6 w-full rounded-full"><Link to="/admin/reviews">Review submissions <ArrowUpRight /></Link></Button>
        </div></section>
      </div>
    </div>
  );
}

type OverviewData = Awaited<ReturnType<typeof adminOverview>>;
const rate = (n: number, of: number) => (of ? Math.min(100, Math.round((n / of) * 100)) : null);
function summarise(d: OverviewData, r: DateRange) {
  const e = d.enquiries.filter((x) => inRange(x.created_at, r)), c = d.completed.filter((x) => inRange(x.completed_at, r));
  const funnel = { free_review: { viewed: 0, started: 0, completed: 0 }, private_clinic: { viewed: 0, started: 0, completed: 0 } } as Record<string, Record<"viewed" | "started" | "completed", number>>;
  for (const f of d.funnel) if (inRange(f.created_at, r) && funnel[f.session] && f.step in funnel[f.session]!) funnel[f.session]![f.step as "viewed"]++;
  const pay = d.payments.filter((x) => inRange(x.paid_at, r));
  return {
    total: e.length, free: e.filter((x) => x.kind === "free_review").length, clinic: e.filter((x) => x.kind === "private_clinic").length, mentor: e.filter((x) => x.kind === "mentorship").length,
    newOnes: e.filter((x) => x.status === "new").length, xrays: c.length, booked: c.filter((x) => x.booked).length,
    started: d.started.filter((x) => inRange(x, r)).length, stripe: pay.filter((x) => x.provider === "stripe").length, flw: pay.filter((x) => x.provider === "flutterwave").length,
    funnel: funnel as { free_review: Record<"viewed" | "started" | "completed", number>; private_clinic: Record<"viewed" | "started" | "completed", number> },
  };
}
type Summary = ReturnType<typeof summarise>;
function ClinicPulse({ data, range, m, p }: { data: OverviewData; range: DateRange; m: Summary; p: Summary }) {
  const bs = buckets(range);
  const enq = countIn(data.enquiries.map((x) => x.created_at), bs), xr = countIn(data.completed.map((x) => x.completed_at), bs);
  const [sel, setSel] = useState<number | null>(null);
  const b = sel != null ? bs[sel] : undefined;
  const completion = rate(m.xrays, m.started), bookRate = rate(m.xrays ? m.booked : 0, m.xrays);
  return <section className="clinic-pulse">
    <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center">
      <div>
        <p className="clinic-pulse-tag"><HeartPulse className="h-4 w-4" /> Clinic vitals · {fmtRange(range)}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Vital n={m.total} label="Sales Clinic enquiries" dot="primary" delta={change(m.total, p.total)} />
          <Vital n={m.xrays} label="Completed X-Rays" dot="soft" delta={change(m.xrays, p.xrays)} />
          <Vital n={completion == null ? "-" : `${completion}%`} label="X-Rays started that were finished" />
          <Vital n={bookRate == null ? "-" : `${bookRate}%`} label="X-Rays that booked a call" />
        </div>
      </div>
      <div className="clinic-pulse-chart">
        {m.total + m.xrays === 0
          ? <EmptyState icon={Activity} title="No activity in this period" body="The heartbeat line appears as soon as enquiries or X-Rays come in." />
          : <>
            <PulseChart labels={bs.map((x) => x.label)} selected={sel} onSelect={setSel} series={[{ name: "Enquiries", values: enq, tone: "primary" }, { name: "X-Rays", values: xr, tone: "soft" }]} />
            {b ? <div className="drill-panel text-foreground"><strong>{fmtRange(b)}</strong>
              <Link to="/admin/enquiries" search={{ from: b.from, to: b.to }} className="drill-link">{enq[sel!]} enquiries <ArrowUpRight className="h-3.5 w-3.5" /></Link>
              <Link to="/admin/xray" search={{ from: b.from, to: b.to }} className="drill-link">{xr[sel!]} X-Rays <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
              : <p className="mt-3 text-xs opacity-70">Tap a point on the line to open that day's records.</p>}
          </>}
      </div>
    </div>
  </section>;
}
function Vital({ n, label, dot, delta }: { n: number | string; label: string; dot?: "primary" | "soft"; delta?: number | null }) {
  return <div className="clinic-vital"><p className="flex flex-wrap items-center gap-2 font-display text-3xl font-extrabold tabular-nums">{n}{delta !== undefined && <Delta pct={delta} light />}</p><p className="mt-1 flex items-center gap-1.5 text-xs opacity-70">{dot && <span className={`vital-dot vital-${dot}`} />}{label}</p></div>;
}

function Stat({ label, sub, n, delta, icon: Icon, to, search, accent = false }: { label: string; sub?: string | undefined; n: number | string; delta?: number | null; icon: typeof Inbox; to: "/admin/enquiries" | "/admin/xray" | "/admin/reviews" | "/admin/payments"; search?: Record<string, string>; accent?: boolean }) {
  return (
    <Link to={to} search={search as never} className={`dashboard-stat ${accent ? "dashboard-stat-accent" : ""}`}><div className="flex items-center justify-between gap-2"><span className="dashboard-stat-icon"><Icon className="h-5 w-5" /></span>{delta !== undefined ? <Delta pct={delta} light={accent} /> : <ArrowUpRight className="h-4 w-4 opacity-50" />}</div><p className="mt-6 font-display text-4xl font-extrabold tabular-nums">{n}</p><p className="mt-2 text-sm font-medium leading-snug opacity-80">{label}</p>{sub && <p className="mt-1 text-xs leading-snug opacity-70">{sub}</p>}</Link>
  );
}
