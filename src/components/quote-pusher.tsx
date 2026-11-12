import { useEffect, useRef, useState, type ReactNode } from "react";
import push from "@/assets/mascot-push.png";
import wave from "@/assets/mascot-wave-free.png";

type Phase = "idle" | "push" | "wave" | "gone";

/** Dr. Dan's mascot shoves the quote into place, waves, then steps away. Decorative only. */
export function QuotePusher({ children, className = "" }: { children: ReactNode; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("gone"); return; }
    const timers: number[] = [];
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      setPhase("push");
      timers.push(window.setTimeout(() => setPhase("wave"), 1500), window.setTimeout(() => setPhase("gone"), 4200));
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, []);
  return <div ref={host} className={`quote-pusher relative ${className}`} data-phase={phase}>
    <div className="quote-pusher-card">{children}</div>
    <div className="quote-pusher-actor" aria-hidden="true">
      <img src={push} alt="" className="quote-pusher-push" />
      <img src={wave} alt="" className="quote-pusher-wave" />
    </div>
  </div>;
}
