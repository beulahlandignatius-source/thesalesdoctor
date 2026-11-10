import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminOverview } from "@/lib/enquiries.functions";
import { KIND_LABEL, fmt } from "@/components/admin/enquiry-labels";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Overview — Sales Admin" },
      { name: "description", content: "Private overview of Sales Clinic enquiries and Client X-Rays." },
      { property: "og:title", content: "Overview — Sales Admin" },
      { property: "og:description", content: "Private admin overview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-overview"], queryFn: () => adminOverview() });
  if (isLoading) return <p role="status" className="text-muted-foreground">Loading…</p>;
  if (isError || !data) return <p role="alert" className="text-destructive">Couldn’t load the overview. Please refresh.</p>;
  const clinic = [["Free reviews", data.free], ["Private Clinics", data.clinic], ["Mentorship", data.mentor], ["New, not yet handled", data.newOnes]] as const;
  const xray = [["Completed X-Rays", data.xrays], ["Booked after X-Ray", data.booked]] as const;
  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl font-extrabold">Overview</h1>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Sales Clinic</h2>
          <Link to="/admin/enquiries" className="text-sm font-semibold text-primary">See all enquiries →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {clinic.map(([l, n]) => <Stat key={l} label={l} n={n} />)}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-bold">Client X-Ray</h2>
          <Link to="/admin/xray" className="text-sm font-semibold text-primary">See all X-Rays →</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {xray.map(([l, n]) => <Stat key={l} label={l} n={n} />)}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl font-bold">Latest enquiries</h2>
        <ul className="mt-4 divide-y divide-border rounded-3xl border border-border bg-card">
          {data.recent.length === 0 && <li className="p-6 text-center text-muted-foreground">No enquiries yet.</li>}
          {data.recent.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{KIND_LABEL[r.kind] ?? r.kind} · {fmt(r.created_at)}</p>
              </div>
              <span className="rounded-full bg-blush px-3 py-1 text-xs font-semibold capitalize text-primary">{r.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, n }: { label: string; n: number }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="font-display text-3xl font-black text-foreground">{n}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
