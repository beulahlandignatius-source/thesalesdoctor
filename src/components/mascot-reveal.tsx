import { useEffect, useRef, useState } from "react";
import { MascotCharacter, type CharacterState } from "@/components/mascot-character";

type Mode = "push" | "curtain" | "travel";
type Beat = { state: CharacterState; at: number; x: number; out?: boolean };

// Each mode tells a short story with matching expressions; x is 0..1 across the lane.
const STORIES: Record<Mode, { beats: Beat[]; length: number; loop: boolean; revealAt: number }> = {
  travel: { length: 9000, loop: true, revealAt: 2600, beats: [
    { state: "welcome", at: 0, x: 0 }, { state: "thinking", at: 1300, x: 0.15 },
    { state: "diagnosing", at: 2600, x: 0.5 }, { state: "explaining", at: 4600, x: 0.85 },
    { state: "encouraging", at: 6200, x: 1 }, { state: "welcome", at: 7600, x: 0.4 },
  ] },
  push: { length: 5200, loop: false, revealAt: 1200, beats: [
    { state: "thinking", at: 0, x: 0 }, { state: "explaining", at: 1200, x: 0.35 },
    { state: "encouraging", at: 2300, x: 0.35 }, { state: "welcome", at: 3200, x: 0.35 },
    { state: "welcome", at: 4400, x: 0.35, out: true },
  ] },
  curtain: { length: 5600, loop: false, revealAt: 1600, beats: [
    { state: "diagnosing", at: 0, x: 0.1 }, { state: "explaining", at: 1600, x: 0.45 },
    { state: "celebrating", at: 3000, x: 0.8 }, { state: "encouraging", at: 4400, x: 0.8 },
  ] },
};

export function MascotReveal({ targets, mode = "push" }: { targets: string; mode?: Mode }) {
  const lane = useRef<HTMLDivElement>(null);
  const [beat, setBeat] = useState<Beat>(STORIES[mode].beats[0] ?? { state: "welcome", at: 0, x: 0 });
  useEffect(() => {
    const host = lane.current;
    const section = host?.closest("section");
    if (!host || !section) return;
    const story = STORIES[mode];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const items = Array.from(section.querySelectorAll<HTMLElement>(targets));
    const animations: Animation[] = [];
    const reveal = () => items.forEach((el, i) => {
      el.classList.remove("fx-reveal");
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        animations.push(el.animate([{ translate: `${i % 2 === 0 ? -64 : 64}px 0`, opacity: .25 }, { translate: "0 0", opacity: 1 }],
          { duration: 850, delay: (i % 3) * 120, easing: "cubic-bezier(.22,1,.36,1)" }));
      }, { threshold: .15 });
      observers.push(observer); observer.observe(el);
    });
    const observers: IntersectionObserver[] = [];
    const play = () => {
      story.beats.forEach(b => timers.push(window.setTimeout(() => setBeat(b), b.at)));
      timers.push(window.setTimeout(reveal, story.revealAt));
      if (story.loop) timers.push(window.setTimeout(play, story.length));
    };
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      observer.disconnect();
      if (reduce) { const last = story.beats.at(-1); if (last) setBeat(last); return; }
      play();
    }, { threshold: .2 });
    observer.observe(host);
    return () => { observer.disconnect(); observers.forEach(io => io.disconnect()); animations.forEach(a => a.cancel()); timers.forEach(clearTimeout); };
  }, [targets, mode]);
  return <div ref={lane} className={`mascot-reveal-lane mascot-reveal-${mode}`} aria-hidden="true">
    <div className="mascot-reveal-actor" data-out={beat.out ? "" : undefined} style={{ left: `calc(${beat.x} * (100% - var(--actor-size)))` }}>
      <MascotCharacter state={beat.state} />
    </div>
    <span className="mascot-reveal-track" />
  </div>;
}
