import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ENQUIRY_STATUSES, listEnquiries, updateEnquiryStatus } from "@/lib/enquiries.functions";
import { DETAIL_LABEL, KIND_LABEL, fmt } from "@/components/admin/enquiry-labels";

export const Route = createFileRoute("/admin/enquiries")({
  head: () => ({
    meta: [
      { title: "Sales Clinic enquiries | Sales Admin" },
      { name: "description", content: "Private list of free review, Private Sales Clinic and mentorship enquiries." },
      { property: "og:title", content: "Sales Clinic enquiries | Sales Admin" },
      { property: "og:description", content: "Private admin list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Enquiries,
});

function Enquiries() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-enquiries"], queryFn: () => listEnquiries() });
  const setStatus = useMutation({
    mutationFn: (v: { id: string; status: (typeof ENQUIRY_STATUSES)[number] }) => updateEnquiryStatus({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
      qc.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatusF] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => (data ?? []).filter((r) => {
    const t = q.trim().toLowerCase();
    if (t && !`${r.name} ${r.email} ${r.whatsapp}`.toLowerCase().includes(t)) return false;
    if (kind && r.kind !== kind) return false;
    if (status && r.status !== status) return false;
    return true;
  }), [data, q, kind, status]);

  const sel = "field !py-2 text-sm min-h-11 sm:!w-auto";
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-extrabold">Sales Clinic enquiries</h1>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input aria-label="Search" placeholder="Search name, email or WhatsApp" value={q} onChange={(e) => setQ(e.target.value)} className="field !py-2 text-sm sm:!w-72" />
        <select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value)} className={sel}>
          <option value="">All types</option>
          {Object.entries(KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => setStatusF(e.target.value)} className={sel}>
          <option value="">All statuses</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? <p role="status" className="text-muted-foreground">Loading…</p>
          : isError ? <p role="alert" className="text-destructive">Couldn’t load enquiries. Please refresh.</p>
          : !rows.length ? <p className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">{data?.length ? "No enquiries match these filters." : "No enquiries yet."}</p>
          : rows.map((r) => (
            <article key={r.id} className="rounded-3xl border border-border bg-card">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
                <button onClick={() => setOpen(open === r.id ? null : r.id)} className="min-w-0 text-left" aria-expanded={open === r.id}>
                  <p className="font-semibold">{r.name} <span className="ml-2 rounded-full bg-blush px-2.5 py-0.5 text-xs font-semibold text-primary">{KIND_LABEL[r.kind] ?? r.kind}</span></p>
                  <p className="mt-1 break-all text-sm text-muted-foreground">{r.email} · {r.whatsapp}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{fmt(r.created_at)} · {open === r.id ? "Hide details" : "Show details"}</p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`https://wa.me/${r.whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-primary">WhatsApp</a>
                  <a href={`mailto:${r.email}`} className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-semibold hover:border-primary">Email</a>
                  <select aria-label={`Status for ${r.name}`} value={r.status} disabled={setStatus.isPending}
                    onChange={(e) => setStatus.mutate({ id: r.id, status: e.target.value as (typeof ENQUIRY_STATUSES)[number] })}
                    className="field !w-auto !py-2 text-sm min-h-11 capitalize">
                    {ENQUIRY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              {open === r.id && (
                <dl className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
                  {Object.entries(r.details).filter(([, v]) => (Array.isArray(v) ? v.length : v)).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{DETAIL_LABEL[k] ?? k}</dt>
                      <dd className="mt-1 whitespace-pre-wrap break-words">{Array.isArray(v) ? v.join(", ") : v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          ))}
      </div>
    </div>
  );
}
