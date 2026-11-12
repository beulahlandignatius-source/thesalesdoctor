import { useEffect, useRef, useState } from "react";
import wave from "@/assets/mascot-wave-free.png";
import thinking from "@/assets/mascot-thinking.png";
import push from "@/assets/mascot-push.png";
import explaining from "@/assets/mascot-findings.png";
import celebrating from "@/assets/mascot-celebrating.png";

type Beat = { img: string; move: string; q: number | null; bubble: string | null; ms: number };

/** Decorative story: Dr. Dan drops in, walks each session question, pushes it forward and celebrates. */
export function SessionGuide({ titles, outro }: { titles: string[]; outro: string }) {
  const host = useRef<HTMLDivElement>(null);
  const beats: Beat[] = [
    { img: wave, move: "drop", q: null, bubble: outro, ms: 2200 },
    { img: thinking, move: "ponder", q: 0, bubble: titles[0] ?? null, ms: 2400 },
    { img: push, move: "shove", q: 1, bubble: titles[1] ?? null, ms: 2400 },
    { img: explaining, move: "point", q: 2, bubble: titles[2] ?? null, ms: 2400 },
    { img: celebrating, move: "jump", q: null, bubble: outro, ms: 2600 },
  ];
  const [i, setI] = useState(-1);
  useEffect(() => {
    const el = host.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setI(0); return; }
    let t: number | undefined; let on = false; let idx = -1;
    const step = () => { idx = (idx + 1) % beats.length; setI(idx); t = window.setTimeout(step, beats[idx]!.ms); };
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting && !on) { on = true; step(); }
      else if (!e?.isIntersecting && on) { on = false; window.clearTimeout(t); }
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(t); };
  }, []);
  const beat = i >= 0 ? beats[i]! : null;
  useEffect(() => {
    const section = host.current?.closest("section");
    section?.querySelectorAll(".session-question").forEach((li, n) => li.toggleAttribute("data-guided", beat?.q === n));
  }, [beat]);
  return <div ref={host} className="session-guide" data-move={beat?.move ?? "idle"} aria-hidden="true">
    <span className="session-guide-glow" />
    <span className="session-guide-ring" key={`r${i}`} />
    {beat?.bubble && <span key={`b${i}`} className="session-guide-bubble">{beat.bubble}</span>}
    <div className="session-guide-actor"><img key={i} src={beat?.img ?? wave} alt="" draggable={false} /></div>
    {beat?.move === "jump" && <span className="session-guide-burst" key={`c${i}`}>{Array.from({ length: 10 }, (_, n) => <i key={n} style={{ ["--a" as string]: `${n * 36}deg` }} />)}</span>}
    <span className="session-guide-shadow" />
  </div>;
}
