import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Desktop uses display:contents; phones read the same content one screen at a time. */
export function MobileXrayDeck({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pages = Children.toArray(children);
  const [page, setPage] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const current = host.current?.querySelector<HTMLElement>(`[data-deck-page="${page}"]`);
    if (window.matchMedia("(max-width: 639px)").matches) current?.focus({ preventScroll: true });
  }, [page]);
  return <div ref={host} className={`mobile-xray-deck ${className}`}>
    <div className="mobile-xray-pages">
      {pages.map((child, index) => <div key={index} data-deck-page={index} tabIndex={-1} className={`mobile-xray-page ${page === index ? "deck-active" : ""}`}>{child}</div>)}
    </div>
    <nav className="mobile-xray-controls" aria-label="X-Ray screens">
      <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}><ArrowLeft /> Back</Button>
      <span aria-live="polite">{page + 1} / {pages.length}</span>
      <Button variant="premium" size="sm" disabled={page === pages.length - 1} onClick={() => setPage(page + 1)}>Next <ArrowRight /></Button>
    </nav>
  </div>;
}