import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, ExternalLink, Info, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listPaymentProofs, reviewPaymentProof } from "@/lib/payment-proof.functions";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({ meta: [
    { title: "Payment screenshots | The Sales Clinic Admin" },
    { name: "description", content: "Review payment screenshots uploaded by Private Sales Clinic visitors." },
    { property: "og:title", content: "Payment screenshots | The Sales Clinic Admin" },
    { property: "og:description", content: "Private payment screenshot review for The Sales Clinic." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Payments,
});

const LABEL: Record<string, string> = { pending: "To check", verified: "Verified by you", rejected: "Rejected" };

function Payments() {
  const [filter, setFilter] = useState("pending");
  const qc = useQueryClient();
  const load = useServerFn(listPaymentProofs);
  const update = useServerFn(reviewPaymentProof);
  const { data, isPending, isError } = useQuery({ queryKey: ["admin-payment-proofs"], queryFn: () => load() });
  const m = useMutation({
    mutationFn: (d: { id: string; status: "pending" | "verified" | "rejected" }) => update({ data: d }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-payment-proofs"] }),
  });
  const rows = (data ?? []).filter((r) => !filter || r.status === filter);
  return <div className="admin-page admin-payment-page">
    <h1 className="text-3xl font-extrabold">Payment screenshots</h1>
    <p className="mt-3 flex max-w-2xl gap-2 rounded-2xl bg-secondary p-4 text-sm"><Info className="h-4 w-4 shrink-0 text-primary" />Screenshots are uploaded by visitors and are not proof of payment. Check the payment in Stripe or Flutterwave before marking it verified. Paid clinic counts on the Overview come only from Stripe and Flutterwave directly.</p>
    <select aria-label="Screenshot status" className="field mt-6 sm:!w-56" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="pending">To check</option><option value="verified">Verified by you</option><option value="rejected">Rejected</option><option value="">All</option></select>
    {m.isError && <p className="mt-4 text-destructive" role="alert">Couldn’t update. Please try again.</p>}
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {isPending ? <p role="status">Loading screenshots…</p> : isError ? <p role="alert">Couldn’t load screenshots. Please refresh.</p> : rows.length === 0 ? <p className="py-8 text-muted-foreground">No screenshots in this view.</p> : rows.map((r) => <article key={r.id} className="overflow-hidden rounded-3xl border border-border bg-card">
        {r.url && (r.content_type.startsWith("image/") && r.content_type !== "image/heic"
          ? <a href={r.url} target="_blank" rel="noopener noreferrer"><img src={r.url} alt={`Payment screenshot from ${r.name}`} className="h-64 w-full bg-muted object-contain" /></a>
          : <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex h-32 items-center justify-center gap-2 bg-muted font-semibold text-primary">Open file <ExternalLink className="h-4 w-4" /></a>)}
        <div className="p-5">
          <div className="flex flex-wrap justify-between gap-2"><div className="min-w-0"><h2 className="truncate font-bold">{r.name}</h2><p className="truncate text-sm text-muted-foreground">{r.email}</p></div><span className="text-sm font-semibold text-primary">{LABEL[r.status]}</span></div>
          <p className="mt-2 text-sm text-muted-foreground">{r.provider === "stripe" ? "Stripe · USD" : "Flutterwave · NGN"} · {new Date(r.created_at).toLocaleString()}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button className="rounded-full" disabled={m.isPending || r.status === "verified"} onClick={() => m.mutate({ id: r.id, status: "verified" })}><Check />Mark verified</Button>
            <Button variant="outline" className="rounded-full" disabled={m.isPending || r.status === "rejected"} onClick={() => m.mutate({ id: r.id, status: "rejected" })}><X />Reject</Button>
            {r.status !== "pending" && <Button variant="ghost" className="rounded-full" disabled={m.isPending} onClick={() => m.mutate({ id: r.id, status: "pending" })}><RotateCcw />Undo</Button>}
          </div>
        </div>
      </article>)}
    </div>
  </div>;
}
