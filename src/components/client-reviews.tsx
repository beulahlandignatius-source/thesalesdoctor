import type React from "react";
import { useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Star, MessageSquarePlus, Check, Send, Images, Camera, ImagePlus, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StackedCards } from "./stacked-cards";
import { publicReviews, submitReview } from "@/lib/reviews.functions";
import { reviewSchema } from "@/lib/reviews";

export const reviewsQuery = queryOptions({ queryKey: ["public-reviews"], queryFn: () => publicReviews(), staleTime: 60_000 });

export function ClientReviews() {
  const { data } = useSuspenseQuery(reviewsQuery);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const save = useServerFn(submitReview);
  const cards = data.map(r => ({ ...r, rating: r.source_key ? null : r.rating }));
  return <div className="mt-16 grid items-center gap-12 md:grid-cols-2">
    <div className="reviews-intro">
      <p className="eyebrow">Reviews</p>
      <div className="mt-6 flex flex-wrap gap-3"><Button variant="premium" className="gap-2" onClick={() => { setDone(false); setError(""); setRating(0); setOpen(true); }}><MessageSquarePlus /> Write a review</Button>
      <Link to="/reviews" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"><Images className="h-4 w-4" /> See more</Link></div>
    </div>
    <StackedCards label="review" items={cards.map((r, i) => <>
      <div className="stack-badge review-avatar" aria-hidden="true">{r.photoUrl ? <img src={r.photoUrl} alt="" className="h-full w-full rounded-full object-cover" /> : <span className="font-display text-3xl font-bold">{r.name?.split(" ").map((p: string) => p[0]).join("").slice(0, 2)}</span>}<span className="stack-number">{i + 1}</span></div>
      {r.rating !== null && <div className="mt-6 flex justify-center gap-1 text-primary" aria-label={`${r.rating} out of 5 stars`}>{[1,2,3,4,5].map((n) => <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-current" : "opacity-25"}`} />)}</div>}
      <blockquote className="mt-6 whitespace-pre-wrap break-words text-lg font-semibold leading-relaxed">{r.body}</blockquote>
      {r.source_key && <p className="mt-3 text-xs text-muted-foreground">Demo review</p>}
      <p className="mt-auto pt-7 text-sm"><strong className="block">{r.name}</strong><span className="text-muted-foreground">{r.role}</span></p>
    </>)} />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl">
        <DialogHeader><DialogTitle>{done ? "Thank you for your review" : "Write a review"}</DialogTitle><DialogDescription>{done ? "Your review has been saved and is awaiting approval." : "Worked with Dr. Dan? Share your honest feedback in under 2 minutes."}</DialogDescription></DialogHeader>
        {done ? <div className="py-8 text-center"><Check className="mx-auto h-12 w-12 text-primary" /><Button className="mt-6 rounded-full" onClick={() => setOpen(false)}>Done</Button></div> : <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault(); const form = new FormData(e.currentTarget);
          const parsed = reviewSchema.safeParse({ name: form.get("name"), role: form.get("role"), body: form.get("body"), rating, consent: form.get("consent") === "on", website: form.get("website") ?? "" });
          if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Please check your review."); return; }
          setBusy(true); setError("");
          try {
            const photo = await readImage(form.get("photo"));
            const screenshot = await readImage(form.get("screenshot"));
            await save({ data: { ...parsed.data, photo, screenshot } });
            window.__lovableEvents?.track?.("project.review_submitted", {});
            setDone(true);
          } catch (err) { setError(err instanceof Error && err.message.includes("5MB") ? err.message : "Your review couldn’t be saved. Please try again."); } finally { setBusy(false); }
        }}>
          <fieldset><legend className="text-sm font-semibold">Your rating</legend><div className="mt-2 flex gap-2">{[1,2,3,4,5].map((n) => <Button type="button" key={n} variant="ghost" size="icon" aria-label={`Rate ${n} stars`} aria-pressed={rating === n} onClick={() => setRating(n)} className="text-primary"><Star className={`!h-7 !w-7 ${n <= rating ? "fill-current" : ""}`} /></Button>)}</div></fieldset>
          <label className="block text-sm font-semibold">Name<input name="name" required maxLength={120} className="field mt-2" autoComplete="name" /></label>
          <label className="block text-sm font-semibold">Role or business (optional)<input name="role" maxLength={120} className="field mt-2" placeholder="e.g. Founder, brand studio" /></label>
          <label className="block text-sm font-semibold">Your review<textarea name="body" required minLength={10} maxLength={1500} rows={4} className="field mt-2" placeholder="What changed for you after working with Dr. Dan?" /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <UploadTile name="photo" label="Your headshot" hint="Optional. Shown beside your review" icon={<Camera className="h-6 w-6" />} round />
            <UploadTile name="screenshot" label="Results screenshot" hint="Optional. A win, message or result" icon={<ImagePlus className="h-6 w-6" />} />
          </div>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP, up to 5MB each.</p>
          <div className="hidden" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
          <label className="flex gap-3 text-sm"><input type="checkbox" name="consent" required className="mt-1" />I agree to my name and review being published.</label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" variant="premium" disabled={busy} className="w-full"><Send />{busy ? "Saving…" : "Submit review"}</Button>
        </form>}
      </DialogContent>
    </Dialog>
  </div>;
}
export async function readImage(v: FormDataEntryValue | null) {
  if (!(v instanceof File) || v.size === 0) return null;
  if (v.size > 5 * 1024 * 1024) throw new Error("Images must be under 5MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(v.type)) throw new Error("Images must be JPG, PNG or WebP under 5MB.");
  const buf = new Uint8Array(await v.arrayBuffer());
  let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { base64: btoa(bin), contentType: v.type as "image/jpeg" | "image/png" | "image/webp" };
}

export function UploadTile({ name, label, hint, icon, round, initialPreview }: { name: string; label: string; hint: string; icon: React.ReactNode; round?: boolean; initialPreview?: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);
  return <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-4 text-center transition hover:border-primary">
    {(preview || initialPreview) ? <img src={preview || initialPreview || ""} alt="" className={`h-20 object-cover ${round ? "w-20 rounded-full" : "w-full rounded-xl"}`} /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span>}
    <span className="text-sm font-semibold">{label}</span>
    <span className="text-xs text-muted-foreground">{preview ? "Tap to change" : hint}</span>
    {preview && <Button type="button" variant="ghost" size="icon" aria-label={`Remove ${label}`} className="absolute right-2 top-2 rounded-full bg-background" onClick={(e) => { e.preventDefault(); const input = e.currentTarget.parentElement?.querySelector("input"); if (input) input.value = ""; setPreview(null); }}><X className="h-4 w-4" /></Button>}
    <input type="file" name={name} accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; setPreview(f ? URL.createObjectURL(f) : null); }} />
  </label>;
}
