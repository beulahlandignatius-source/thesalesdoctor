import { useEffect, useRef, useState } from "react";

/**
 * Connector that only lives in the gaps between cards, so it never crosses text.
 * Each segment runs from one card's edge to the next card's edge and draws with scroll.
 * `cards` selects the cards; `dot` (optional) is a child used to align the line horizontally.
 */
export function JourneyLine({ cards, dot, className = "" }: { cards: string; dot?: string; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; ys: number[] }>({ w: 1, h: 1, d: "", ys: [] });

  useEffect(() => {
    const host = svg.current?.parentElement; if (!host) return;
    const measure = () => {
      const hr = host.getBoundingClientRect();
      const boxes = Array.from(host.querySelectorAll<HTMLElement>(cards)).map((el) => {
        const r = el.getBoundingClientRect(); const a = dot ? el.querySelector<HTMLElement>(dot)?.getBoundingClientRect() : null;
        const x = (a ? a.left + a.width / 2 : r.left + r.width / 2) - hr.left;
        return { x, top: r.top - hr.top, bottom: r.bottom - hr.top, left: r.left - hr.left, right: r.right - hr.left, cy: r.top - hr.top + r.height / 2 };
      });
      let d = ""; const ys: number[] = [];
      for (let i = 0; i < boxes.length - 1; i++) {
        const a = boxes[i]!, b = boxes[i + 1]!;
        if (b.top >= a.bottom - 1) {
          const y1 = a.bottom + 4, y2 = b.top - 4; if (y2 - y1 < 4) continue; const m = (y1 + y2) / 2;
          d += ` M${a.x} ${y1} C${a.x} ${m} ${b.x} ${m} ${b.x} ${y2}`; ys.push(b.top);
        } else if (b.left >= a.right - 1) {
          const x1 = a.right + 4, x2 = b.left - 4; if (x2 - x1 < 8) continue; const y = Math.max(a.top, b.top) + 40;
          d += ` M${x1} ${y} H${x2}`; ys.push(b.top);
        }
      }
      setGeo({ w: hr.width, h: hr.height, d: d.trim(), ys });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(host);
    return () => ro.disconnect();
  }, [cards, dot]);

  useEffect(() => {
    const path = line.current; const host = svg.current?.parentElement; if (!path || !host || !geo.d) return;
    const len = path.getTotalLength(); path.style.strokeDasharray = `${len}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect(); const vh = window.innerHeight;
      const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.65 - r.top) / r.height));
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      head.current?.setAttribute("cx", `${pt.x}`); head.current?.setAttribute("cy", `${pt.y}`);
      head.current?.style.setProperty("opacity", p > 0.01 && p < 0.99 ? "1" : "0");
      const els = host.querySelectorAll<HTMLElement>(cards);
      els.forEach((el, i) => el.classList.toggle("journey-hit", i === 0 ? p > 0.02 : pt.y >= (geo.ys[i - 1] ?? Infinity) - 6 || p >= 0.99));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [geo, cards]);

  return <svg ref={svg} aria-hidden="true" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} className={`journey-line pointer-events-none absolute left-0 top-0 ${className}`}>
    <path d={geo.d} className="journey-ghost" />
    <path ref={line} d={geo.d} className="journey-draw" />
    <circle ref={head} r={5} className="journey-head" />
  </svg>;
}
