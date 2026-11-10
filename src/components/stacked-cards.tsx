import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StackedCards({ items, label }: { items: ReactNode[]; label: string }) {
  const [index, setIndex] = useState(0);
  const start = useRef<number | null>(null);
  const current = Math.min(index, Math.max(0, items.length - 1));
  const go = (delta: number) => setIndex(Math.max(0, Math.min(items.length - 1, current + delta)));
  return <div className="review-stack mx-auto w-full max-w-md" role="region" aria-label={label} aria-roledescription="carousel" tabIndex={0}
    onKeyDown={(e) => { if (e.target !== e.currentTarget) return; if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); }}
    onTouchStart={(e) => { start.current = e.touches[0]?.clientX ?? null; }}
    onTouchEnd={(e) => { const end = e.changedTouches[0]?.clientX; if (start.current !== null && end !== undefined && Math.abs(end - start.current) > 40) go(end < start.current ? 1 : -1); start.current = null; }}>
    <div className="stack-stage">
      {items.map((item, i) => <article key={i} aria-hidden={i !== current} inert={i !== current} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}
        className={`stack-card ${i === current ? "stack-active" : i === current + 1 ? "stack-next" : i === current + 2 ? "stack-last" : "stack-hidden"}`}>
        {item}
      </article>)}
    </div>
    <div className="mt-8 flex items-center justify-between gap-4">
      <Button variant="outline" size="icon" className="rounded-full" title={`Previous ${label}`} aria-label={`Previous ${label}`} disabled={current === 0} onClick={() => go(-1)}><ChevronLeft /></Button>
      <div className="flex items-center gap-1" aria-label={`${label} pages`}>
        {items.map((_, i) => <Button key={i} variant="ghost" size="icon" className="h-11 w-6 rounded-full" aria-label={`Show ${label} ${i + 1}`} aria-current={i === current ? "true" : undefined} onClick={() => setIndex(i)}><span className={`h-1.5 rounded-full ${i === current ? "w-6 bg-primary" : "w-2 bg-border"}`} /></Button>)}
      </div>
      <Button variant="outline" size="icon" className="rounded-full" title={`Next ${label}`} aria-label={`Next ${label}`} disabled={current >= items.length - 1} onClick={() => go(1)}><ChevronRight /></Button>
    </div>
  </div>;
}