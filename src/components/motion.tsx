import { useEffect, useRef } from "react";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Signature connecting line: draws itself as its section scrolls through the viewport. */
export function ScrollPath({ d, className = "" }: { d: string; className?: string }) {
  const ref = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = ref.current; const host = path?.closest("section");
    if (!path || !host) return;
    if (reduced()) { path.style.strokeDashoffset = "0"; return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = host.getBoundingClientRect(); const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
      path.style.strokeDashoffset = String(1 - p);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className={`scroll-path pointer-events-none absolute inset-0 h-full w-full ${className}`}>
    <path d={d} className="scroll-path-ghost" vectorEffect="non-scaling-stroke" />
    <path ref={ref} d={d} pathLength={1} className="scroll-path-line" vectorEffect="non-scaling-stroke" />
  </svg>;
}

/** Word-by-word masked headline reveal. */
export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return <>{text.split(" ").map((w, i) => <span key={i}><span className="word-mask"><span className="word" style={{ animationDelay: `${(start + i) * 70}ms` }}>{w}</span></span>{" "}</span>)}</>;
}

/** Page-level interactions: counters, 3D tilt + spotlight on tiles, magnetic CTAs. */
export function useMotionFx() {
  useEffect(() => {
    if (reduced()) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target as HTMLElement; const raw = el.dataset["count"] ?? el.textContent ?? "";
      const m = raw.match(/^(\D*)(\d+)(.*)$/); if (!m) return;
      const [, pre, num, post] = m; const target = Number(num); const t0 = performance.now();
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1400); el.textContent = `${pre}${Math.round(target * (1 - Math.pow(1 - k, 3)))}${post}`; if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.5 });
    document.querySelectorAll<HTMLElement>(".farmora-home .proof-number, .farmora-home .hero-stat dt").forEach((el) => { el.dataset["count"] = el.textContent ?? ""; io.observe(el); });

    // Staggered scroll reveals for cards and rows.
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>(".farmora-home .session-question, .farmora-home .who-bento-tile, .farmora-home .mentorship-benefit, .farmora-home .proof-tile, .farmora-home section h2, .farmora-home section .eyebrow"));
    const rio = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("fx-in"); rio.unobserve(e.target); } }), { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => { const sib = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0; el.style.setProperty("--fx-delay", `${Math.min(sib, 5) * 90}ms`); el.classList.add("fx-reveal"); rio.observe(el); });
    // Subtle parallax for floating décor.
    const para = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let praf = 0;
    const onScroll = () => { if (praf) return; praf = requestAnimationFrame(() => { praf = 0; para.forEach((el) => { el.style.translate = `0 ${window.scrollY * Number(el.dataset["parallax"])}px`; }); }); };
    if (para.length) window.addEventListener("scroll", onScroll, { passive: true });

    const fine = window.matchMedia("(pointer: fine)").matches;
    const tiles = fine ? Array.from(document.querySelectorAll<HTMLElement>(".farmora-home .proof-tile, .farmora-home .session-question, .farmora-home .mentorship-benefit, .farmora-home .hero-stat")) : [];
    const move = (e: PointerEvent) => { const el = e.currentTarget as HTMLElement; const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-4px)`; };
    const leave = (e: PointerEvent) => { (e.currentTarget as HTMLElement).style.transform = ""; };
    tiles.forEach((t) => { t.classList.add("fx-tilt"); t.addEventListener("pointermove", move); t.addEventListener("pointerleave", leave); });

    const ctas = fine ? Array.from(document.querySelectorAll<HTMLElement>(".farmora-home section a[href^='/book'], .farmora-home section a[href^='/mentorship']")) : [];
    const mag = (e: PointerEvent) => { const el = e.currentTarget as HTMLElement; const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.15}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`; };
    ctas.forEach((c) => { c.addEventListener("pointermove", mag); c.addEventListener("pointerleave", leave); });
    return () => { io.disconnect(); rio.disconnect(); window.removeEventListener("scroll", onScroll); cancelAnimationFrame(praf); tiles.forEach((t) => { t.removeEventListener("pointermove", move); t.removeEventListener("pointerleave", leave); }); ctas.forEach((c) => { c.removeEventListener("pointermove", mag); c.removeEventListener("pointerleave", leave); }); };
  }, []);
}
