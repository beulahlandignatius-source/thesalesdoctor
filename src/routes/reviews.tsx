import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ImagePlus, Star, ArrowLeft } from "lucide-react";
import { reviewsQuery } from "@/components/client-reviews";

export const Route = createFileRoute("/reviews")({
  head: () => ({ meta: [
    { title: "Client reviews and results gallery | The Sales Clinic" },
    { name: "description", content: "Reviews, photos and result screenshots shared by Sales Clinic clients." },
    { property: "og:title", content: "Client reviews and results gallery | The Sales Clinic" },
    { property: "og:description", content: "Reviews, photos and result screenshots shared by Sales Clinic clients." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(reviewsQuery),
  component: Gallery,
});

function Gallery() {
  const { data } = useSuspenseQuery(reviewsQuery);
  const shots = data.filter((r) => r.screenshotUrl);
  const placeholders = Math.max(0, 6 - shots.length);
  return <main className="mx-auto max-w-6xl px-5 py-16 md:py-24">
    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back home</Link>
    <p className="eyebrow mt-8">Reviews</p>
    <h1 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">Testimonials <span className="text-primary">gallery.</span></h1>
    <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
      {shots.map((r) => <figure key={r.id} className="mb-5 break-inside-avoid overflow-hidden rounded-3xl border border-border bg-card">
        <a href={r.screenshotUrl!} target="_blank" rel="noreferrer"><img src={r.screenshotUrl!} alt={`Result screenshot shared by ${r.name}`} loading="lazy" className="w-full" /></a>
        <figcaption className="flex items-center gap-3 p-5">
          {r.photoUrl ? <img src={r.photoUrl} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="grid h-11 w-11 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{r.name.slice(0, 1)}</span>}
          <span className="min-w-0"><strong className="block truncate">{r.name}</strong><span className="flex gap-0.5 text-primary">{[1,2,3,4,5].map((n) => <Star key={n} className={`h-3 w-3 ${n <= r.rating ? "fill-current" : "opacity-25"}`} />)}</span></span>
        </figcaption>
      </figure>)}
      {Array.from({ length: placeholders }, (_, i) => <div key={i} className={`mb-5 grid break-inside-avoid place-items-center rounded-3xl border-2 border-dashed border-border bg-muted/40 p-8 text-center text-muted-foreground ${i % 2 ? "h-56" : "h-80"}`}>
        <div><ImagePlus className="mx-auto h-8 w-8" /><p className="mt-3 text-sm font-semibold">Client screenshot coming soon</p></div>
      </div>)}
    </div>
  </main>;
}
