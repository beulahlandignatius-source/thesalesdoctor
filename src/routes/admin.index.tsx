import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminOverview } from "@/lib/enquiries.functions";
import { KIND_LABEL, fmt } from "@/components/admin/enquiry-labels";
import { adminReviews } from "@/lib/reviews.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Inbox, ScanLine, Star, CalendarCheck, ArrowUpRight, RefreshCw, ClipboardList, Users, CircleCheck, CreditCard } from "lucide-react";

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
  component: Overview,
});

function Overview() {
  const load = useServerFn(adminOverview);
  const loadReviews = useServerFn(adminReviews);
  const overview = useQuery({ queryKey: ["admin-overview"], queryFn: () => load() });
  const reviews = useQuery({ queryKey: ["admin-reviews"], queryFn: () => loadReviews() });
  const { data, isLoading, isError } = overview;
  if (isLoading) return <div role="status" className="grid animate-pulse gap-5 sm:grid-cols-2"><div className="h-36 rounded-3xl bg-muted" /><div className="h-36 rounded-3xl bg-muted" /><span className="sr-only">Loading…</span></div>;
  if (isError || !data) return <div role="alert"><p className="text-destructive">Couldn’t load the overview. Please refresh.</p><Button variant="outline" className="mt-4 rounded-full" onClick={() => overview.refetch()}><RefreshCw />Refresh</Button></div>;
  const total = data.free + data.clinic + data.mentor;
  const pending = reviews.data?.filter((r) => r.status === "pending").length;
  const clinic = [["Free reviews", data.free], ["Private Clinics", data.clinic], ["Mentorship", data.mentor]] as const;
  return (
    <div className="dashboard-overview space-y-9">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div><p className="eyebrow">The Sales Clinic · Admin</p><h1 className="mt-4 font-display text-4xl font-extrabold">Overview</h1></div>
        <Button variant="outline" className="rounded-full" disabled={overview.isFetching || reviews.isFetching} onClick={() => { overview.refetch(); reviews.refetch(); }}><RefreshCw className={overview.isFetching ? "animate-spin" : ""} />Refresh</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Stat label={`Paid Private Clinics this month · Stripe ${data.stripePaid} · Flutterwave ${data.flutterwavePaid}`} n={data.stripePaid + data.flutterwavePaid} icon={CreditCard} to="/admin/enquiries" accent />
        <Stat label="Sales Clinic enquiries" n={total} icon={Inbox} to="/admin/enquiries" />
        <Stat label="New, not yet handled" n={data.newOnes} icon={ClipboardList} to="/admin/enquiries" />
        <Stat label="Completed X-Rays" n={data.xrays} icon={ScanLine} to="/admin/xray" />
        <Stat label="Awaiting review approval" n={pending ?? "-"} icon={Star} to="/admin/reviews" />
      </div>
      <section>
        <h2 className="mb-5 text-xl font-bold">Bookings this month</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {([["free_review", "Free Client Acquisition Review"], ["private_clinic", "Private Sales Clinic"]] as const).map(([k, label]) => {
            const f = data.funnel[k] ?? { viewed: 0, started: 0, completed: 0 };
            return (
              <div key={k} className="dashboard-distribution">
                <div className="flex items-center gap-2 border-b border-border pb-4"><CalendarCheck className="h-5 w-5 text-primary" /><span className="font-semibold">{label}</span></div>
                <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {([["Calendar views", f["viewed"]], ["Booking starts", f["started"]], ["Completed", f["completed"]]] as const).map(([l, n]) => (
                    <div key={l}><dd className="font-display text-3xl font-extrabold tabular-nums">{n}</dd><dt className="mt-1 text-xs text-muted-foreground">{l}</dt></div>
                  ))}
                </dl>
                <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
                  {([["Views to booking starts", f["started"]], ["Views to completed bookings", f["completed"]]] as const).map(([l, n]) => {
                    const v = f["viewed"] ?? 0;
                    const pct = v ? Math.min(100, Math.round(((n ?? 0) / v) * 100)) : null;
                    return (
                      <div key={l}>
                        <div className="mb-1.5 flex justify-between gap-3"><span className="text-muted-foreground">{l}</span><strong className="tabular-nums">{pct == null ? "No views yet" : `${pct}%`}</strong></div>
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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Sales Clinic</h2><Link to="/admin/enquiries" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">See all enquiries <ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="dashboard-distribution">
            <div className="flex items-center justify-between border-b border-border pb-6"><span className="text-sm text-muted-foreground">Enquiry distribution</span><span className="font-display text-3xl font-extrabold tabular-nums">{total}</span></div>
            <div className="mt-6 space-y-6">{clinic.map(([label, n], i) => <div key={label}><div className="mb-2 flex justify-between gap-3 text-sm"><span>{label}</span><strong className="tabular-nums">{n}</strong></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${i === 0 ? "bg-primary" : i === 1 ? "bg-ink" : "bg-dashboard-accent"}`} style={{ width: `${total ? (n / total) * 100 : 0}%` }} /></div></div>)}</div>
          </div>
        </section>
        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Client X-Ray</h2><Link to="/admin/xray" className="flex min-h-11 items-center gap-2 text-sm font-semibold text-primary">See all X-Rays <ArrowUpRight className="h-4 w-4" /></Link></div>
          <div className="dashboard-xray-summary">
            <ScanLine className="h-10 w-10 text-primary" strokeWidth={1.5} />
            <div className="mt-8 flex items-end justify-between gap-4"><div><p className="font-display text-5xl font-extrabold tabular-nums">{data.xrays}</p><p className="mt-2 text-sm text-muted-foreground">Completed X-Rays</p></div><div className="border-l border-border pl-6"><CalendarCheck className="mb-3 h-5 w-5 text-primary" /><p className="text-2xl font-bold tabular-nums">{data.booked}</p><p className="mt-1 text-xs text-muted-foreground">Booked after X-Ray</p></div></div>
          </div>
        </section>
      </div>
      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0"><div className="mb-5 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Latest enquiries</h2><Inbox className="h-5 w-5 text-muted-foreground" /></div>
          <ul className="dashboard-activity divide-y divide-border">
            {data.recent.length === 0 && <li className="flex flex-col items-center py-14 text-center"><Users className="h-9 w-9 text-muted-foreground/50" strokeWidth={1.5} /><p className="mt-4 text-sm text-muted-foreground">No enquiries yet.</p></li>}
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

function Stat({ label, n, icon: Icon, to, accent = false }: { label: string; n: number | string; icon: typeof Inbox; to: "/admin/enquiries" | "/admin/xray" | "/admin/reviews"; accent?: boolean }) {
  return (
    <Link to={to} className={`dashboard-stat ${accent ? "dashboard-stat-accent" : ""}`}><div className="flex items-center justify-between"><span className="dashboard-stat-icon"><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 opacity-50" /></div><p className="mt-7 font-display text-4xl font-extrabold tabular-nums">{n}</p><p className="mt-2 text-sm opacity-75">{label}</p></Link>
  );
}
