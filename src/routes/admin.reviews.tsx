import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Star, Check, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminReviews, moderateReview } from "@/lib/reviews.functions";

export const Route = createFileRoute("/admin/reviews")({
  head: () => ({ meta: [
    { title: "Review approvals | The Sales Clinic Admin" },
    { name: "description", content: "Approve or hide submitted Sales Clinic client reviews." },
    { property: "og:title", content: "Review approvals | The Sales Clinic Admin" },
    { property: "og:description", content: "Private review moderation for The Sales Clinic." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: Reviews,
});

function Reviews() {
  const [filter, setFilter] = useState("pending");
  const qc = useQueryClient();
  const load = useServerFn(adminReviews);
  const update = useServerFn(moderateReview);
  const { data, isPending, isError } = useQuery({ queryKey: ["admin-reviews"], queryFn: () => load() });
  const mutation = useMutation({
    mutationFn: (data: { id: string; status: "published" | "hidden" }) => update({ data }),
    onSuccess: (_result, variables) => {
      window.__lovableEvents?.track?.("project.review_moderated", {
        decision: variables.status === "published" ? "approved" : "rejected",
      });
      if (variables.status === "published") {
        window.__lovableEvents?.track?.("project.review_published", {});
      }
      qc.invalidateQueries({ queryKey: ["admin-reviews"] });
      qc.invalidateQueries({ queryKey: ["public-reviews"] });
    },
  });
  const rows = (data ?? []).filter((r) => !filter || r.status === filter);
  return <div>
    <h1 className="text-3xl font-extrabold">Reviews</h1>
    <select aria-label="Review status" className="field mt-6 sm:!w-56" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="pending">Awaiting approval</option><option value="published">Published</option><option value="hidden">Hidden</option><option value="">All reviews</option></select>
    {mutation.isError && <p className="mt-4 text-destructive" role="alert">Couldn’t update the review. Please try again.</p>}
    <div className="mt-6 space-y-4">
      {isPending ? <p role="status">Loading reviews…</p> : isError ? <p role="alert">Couldn’t load reviews. Please refresh.</p> : rows.length === 0 ? <p className="py-8 text-muted-foreground">No reviews in this view.</p> : rows.map((r) => <article key={r.id} className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-bold">{r.name}</h2><p className="text-sm text-muted-foreground">{r.role}</p></div><span className="text-sm capitalize text-primary">{r.status}</span></div>
        <div className="mt-4 flex gap-1 text-primary" aria-label={`${r.rating} out of 5 stars`}>{[1,2,3,4,5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-current" : "opacity-25"}`} />)}</div>
        <p className="mt-4 whitespace-pre-wrap break-words">{r.body}</p>
        <div className="mt-6 flex flex-wrap gap-3"><Button className="rounded-full" disabled={mutation.isPending || r.status === "published"} onClick={() => mutation.mutate({ id: r.id, status: "published" })}><Check />Publish</Button><Button variant="outline" className="rounded-full" disabled={mutation.isPending || r.status === "hidden"} onClick={() => mutation.mutate({ id: r.id, status: "hidden" })}><EyeOff />Hide</Button></div>
      </article>)}
    </div>
  </div>;
}