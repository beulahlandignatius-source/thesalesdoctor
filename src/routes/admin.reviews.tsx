import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Star, Check, EyeOff, Pencil, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminReviews, moderateReview, editReview, deleteReview } from "@/lib/reviews.functions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { z } from "zod";

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
  validateSearch: (s: Record<string, unknown>): { record?: string | undefined } => ({ record: z.string().uuid().safeParse(s["record"]).success ? String(s["record"]) : undefined }),
  component: Reviews,
});

function Reviews() {
  const { record } = Route.useSearch();
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<{ id: string; name: string; role: string; rating: number; body: string } | null>(null);
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(null);
  const qc = useQueryClient();
  const load = useServerFn(adminReviews);
  const update = useServerFn(moderateReview);
  const save = useServerFn(editReview);
  const remove = useServerFn(deleteReview);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
    qc.invalidateQueries({ queryKey: ["public-reviews"] });
  };
  const edit = useMutation({ mutationFn: (data: NonNullable<typeof editing>) => save({ data }), onSuccess: () => { setEditing(null); refresh(); } });
  const deletion = useMutation({ mutationFn: (id: string) => remove({ data: { id } }), onSuccess: () => { setDeleting(null); refresh(); } });
  const { data, isPending, isError } = useQuery({ queryKey: ["admin-reviews", record], queryFn: () => load({ data: { record } }) });
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
  const rows = (data ?? []).filter((r) => record ? r.id === record : !filter || r.status === filter);
  return <div className="admin-page admin-review-page">
    <h1 className="text-3xl font-extrabold">Reviews</h1>
    {record ? <Button variant="outline" className="mt-4" asChild><Link to="/admin/reviews" search={{}}>Show all reviews</Link></Button> : <select aria-label="Review status" className="field mt-6 sm:!w-56" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="pending">Awaiting approval</option><option value="published">Published</option><option value="hidden">Hidden</option><option value="">All reviews</option></select>}
    {mutation.isError && <p className="mt-4 text-destructive" role="alert">Couldn’t update the review. Please try again.</p>}
    <div className="mt-6 space-y-4">
      {isPending ? <p role="status">Loading reviews…</p> : isError ? <p role="alert">Couldn’t load reviews. Please refresh.</p> : rows.length === 0 ? <p className="py-8 text-muted-foreground">No reviews in this view.</p> : rows.map((r) => <article key={r.id} className="rounded-3xl border border-border bg-card p-6">
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-bold">{r.name}</h2><p className="text-sm text-muted-foreground">{r.role}</p></div><span className="text-sm capitalize text-primary">{r.status}</span></div>
        <div className="mt-4 flex gap-1 text-primary" aria-label={`${r.rating} out of 5 stars`}>{[1,2,3,4,5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-current" : "opacity-25"}`} />)}</div>
        <p className="mt-4 whitespace-pre-wrap break-words">{r.body}</p>
        {(r.photoUrl || r.screenshotUrl) && <div className="mt-4 flex flex-wrap gap-3">{r.photoUrl && <a href={r.photoUrl} target="_blank" rel="noreferrer"><img src={r.photoUrl} alt={`Photo from ${r.name}`} className="h-20 w-20 rounded-full object-cover" /></a>}{r.screenshotUrl && <a href={r.screenshotUrl} target="_blank" rel="noreferrer"><img src={r.screenshotUrl} alt={`Screenshot from ${r.name}`} className="h-28 rounded-xl border border-border object-cover" /></a>}</div>}
        <div className="mt-6 flex flex-wrap gap-3"><Button className="rounded-full" disabled={mutation.isPending || r.status === "published"} onClick={() => mutation.mutate({ id: r.id, status: "published" })}><Check />Publish</Button><Button variant="outline" className="rounded-full" disabled={mutation.isPending || r.status === "hidden"} onClick={() => mutation.mutate({ id: r.id, status: "hidden" })}><EyeOff />Hide</Button><Button variant="outline" onClick={() => { edit.reset(); setEditing({ id: r.id, name: r.name, role: r.role, rating: r.rating, body: r.body }); }}><Pencil />Edit</Button><Button variant="ghost" className="text-destructive" onClick={() => { deletion.reset(); setDeleting({ id: r.id, name: r.name }); }}><Trash2 />Delete</Button></div>
      </article>)}
    </div>
    <Dialog open={!!editing} onOpenChange={(open) => { if (!open && !edit.isPending) setEditing(null); }}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit review</DialogTitle><DialogDescription>Changes keep the review’s current publication status and photos.</DialogDescription></DialogHeader>
        {editing && <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); edit.mutate(editing); }}>
          <label className="block text-sm font-semibold">Name<input className="field mt-2" required maxLength={120} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Role or business<input className="field mt-2" maxLength={120} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></label>
          <label className="block text-sm font-semibold">Rating<select className="field mt-2" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}</select></label>
          <label className="block text-sm font-semibold">Review<textarea className="field mt-2" required minLength={10} maxLength={1500} rows={5} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></label>
          {edit.isError && <p role="alert" className="text-destructive">Couldn’t save this review. Please try again.</p>}
          <Button type="submit" disabled={edit.isPending}><Save />{edit.isPending ? "Saving…" : "Save review"}</Button>
        </form>}
      </DialogContent>
    </Dialog>
    <Dialog open={!!deleting} onOpenChange={(open) => { if (!open && !deletion.isPending) setDeleting(null); }}>
      <DialogContent><DialogHeader><DialogTitle>Delete review?</DialogTitle><DialogDescription>Remove {deleting?.name}’s review permanently from the website and dashboard. This cannot be undone.</DialogDescription></DialogHeader>
        {deletion.isError && <p role="alert" className="text-destructive">Couldn’t delete this review. Please try again.</p>}
        <div className="flex flex-wrap justify-end gap-3"><Button variant="outline" disabled={deletion.isPending} onClick={() => setDeleting(null)}>Cancel</Button><Button variant="destructive" disabled={deletion.isPending} onClick={() => deleting && deletion.mutate(deleting.id)}><Trash2 />{deletion.isPending ? "Deleting…" : "Delete review"}</Button></div>
      </DialogContent>
    </Dialog>
  </div>;
}