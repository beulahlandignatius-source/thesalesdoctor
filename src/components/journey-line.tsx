import { useEffect, useRef, useState } from "react";

/**
 * Connecting line measured from real elements in its section: it curves through each
 * anchor (number badge, icon), draws itself with scroll and carries a glowing head dot.
 */
export function JourneyLine({ anchors, className = "" }: { anchors: string; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const head = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; pts: [number, number][] }>({ w: 1, h: 1, d: "", pts: [] });

  useEffect(() => {
    const host = svg.current?.parentElement; if (!host) return;
    const measure = () => {
      const hr = host.getBoundingClientRect();
      const pts = Array.from(host.querySelectorAll<HTMLElement>(anchors)).map((el) => {
        const r = el.getBoundingClientRect(); return [r.left - hr.left + r.width / 2, r.top - hr.top + r.height / 2] as [number, number];
      });
      if (!pts.length) return;
      const all: [number, number][] = [[pts[0]![0], 0], ...pts, [pts[pts.length - 1]![0], hr.height]];
      let d = `M${all[0]![0]} ${all[0]![1]}`;
      for (let i = 1; i < all.length; i++) { const [px, py] = all[i - 1]!; const [x, y] = all[i]!; const my = (py + y) / 2; d += ` C${px} ${my} ${x} ${my} ${x} ${y}`; }
      setGeo({ w: hr.width, h: hr.height, d, pts });
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(host);
    return () => ro.disconnect();
  }, [anchors]);

  useEffect(() => {
    const path = line.current; const host = svg.current?.parentElement; if (!path || !host || !geo.d) return;
    const len = path.getTotalLength(); path.style.strokeDasharray = `${len}`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect(); const vh = window.innerHeight;
      const p = reduced ? 1 : Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height));
      path.style.strokeDashoffset = `${len * (1 - p)}`;
      const pt = path.getPointAtLength(len * p);
      head.current?.setAttribute("cx", `${pt.x}`); head.current?.setAttribute("cy", `${pt.y}`);
      head.current?.style.setProperty("opacity", p > 0.01 && p < 0.99 ? "1" : "0");
      host.querySelectorAll<HTMLElement>(anchors).forEach((el, i) => { const a = geo.pts[i]; if (a) el.classList.toggle("journey-hit", pt.y >= a[1] - 4); });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [geo, anchors]);

  return <svg ref={svg} aria-hidden="true" width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`} className={`journey-line pointer-events-none absolute left-0 top-0 ${className}`}>
    <path d={geo.d} className="journey-ghost" />
    <path ref={line} d={geo.d} className="journey-draw" />
    {geo.pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={geo.w < 640 ? 18 : 26} className="journey-ring" />)}
    <circle ref={head} r={6} className="journey-head" />
  </svg>;
}
