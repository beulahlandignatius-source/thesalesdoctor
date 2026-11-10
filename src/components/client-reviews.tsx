import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, MessageSquarePlus, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StackedCards } from "./stacked-cards";
import { publicReviews, submitReview } from "@/lib/reviews.functions";
import { reviewSchema } from "@/lib/reviews";

export const reviewsQuery = queryOptions({ queryKey: ["public-reviews"], queryFn: () => publicReviews(), staleTime: 60_000 });

export function ClientReviews({ existing }: { existing: string[][] }) {
  const { data } = useSuspenseQuery(reviewsQuery);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const save = useServerFn(submitReview);
  const cards = [
    ...existing.map(([body, name, role]) => ({ body, name, role, rating: null })),
    ...data,
  ];
  return <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
    <div>
      <p className="eyebrow">Reviews</p>
      <Button variant="premium" className="mt-6 gap-2" onClick={() => { setDone(false); setError(""); setRating(0); setOpen(true); }}><MessageSquarePlus /> Write a review</Button>
    </div>
    <StackedCards label="review" items={cards.map((r, i) => <>
      <div className="stack-badge"><span className="font-display text-3xl font-bold">{r.name?.slice(0, 1)}</span><span className="stack-number">{i + 1}</span></div>
      {r.rating !== null && <div className="mt-6 flex justify-center gap-1 text-primary" aria-label={`${r.rating} out of 5 stars`}>{[1,2,3,4,5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-current" : "opacity-25"}`} />)}</div>}
      <blockquote className="mt-6 whitespace-pre-wrap break-words text-lg font-semibold leading-relaxed">{r.body}</blockquote>
      <p className="mt-auto pt-7 text-sm"><strong className="block">{r.name}</strong><span className="text-muted-foreground">{r.role}</span></p>
    </>)} />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl">
        <DialogHeader><DialogTitle>{done ? "Thank you for your review" : "Write a review"}</DialogTitle><DialogDescription>{done ? "Your review has been saved and is awaiting approval." : "Share your experience with The Sales Clinic."}</DialogDescription></DialogHeader>
        {done ? <div className="py-8 text-center"><Check className="mx-auto h-12 w-12 text-primary" /><Button className="mt-6 rounded-full" onClick={() => setOpen(false)}>Done</Button></div> : <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault(); const form = new FormData(e.currentTarget);
          const parsed = reviewSchema.safeParse({ name: form.get("name"), role: form.get("role"), body: form.get("body"), rating, consent: form.get("consent") === "on", website: form.get("website") ?? "" });
          if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check your review."); return; }
          setBusy(true); setError("");
          try { await save({ data: parsed.data }); setDone(true); } catch { setError("Your review couldn’t be saved. Please try again."); } finally { setBusy(false); }
        }}>
          <fieldset><legend className="text-sm font-semibold">Your rating</legend><div className="mt-2 flex gap-2">{[1,2,3,4,5].map((n) => <Button type="button" key={n} variant="ghost" size="icon" aria-label={`Rate ${n} stars`} aria-pressed={rating === n} onClick={() => setRating(n)} className="text-primary"><Star className={`!h-7 !w-7 ${n <= rating ? "fill-current" : ""}`} /></Button>)}</div></fieldset>
          <label className="block text-sm font-semibold">Name<input name="name" required maxLength={120} className="field mt-2" autoComplete="name" /></label>
          <label className="block text-sm font-semibold">Role or business (optional)<input name="role" maxLength={120} className="field mt-2" /></label>
          <label className="block text-sm font-semibold">Your review<textarea name="body" required minLength={10} maxLength={1500} rows={4} className="field mt-2" /></label>
          <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <label className="flex gap-3 text-sm"><input type="checkbox" name="consent" required className="mt-1" />I agree to my name and review being published.</label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="premium" disabled={busy} className="w-full"><Send />{busy ? "Saving…" : "Submit review"}</Button>
        </form>}
      </DialogContent>
    </Dialog>
  </div>;
}