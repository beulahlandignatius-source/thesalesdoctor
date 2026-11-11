import { useEffect, useRef } from "react";
import { MascotCharacter } from "@/components/mascot-character";

export function MascotReveal({ targets, mode = "push" }: { targets: string; mode?: "push" | "curtain" | "travel" }) {
  const lane = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = lane.current;
    const section = host?.closest("section");
    if (!host || !section) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    const actor = host.querySelector<HTMLElement>(".mascot-reveal-actor");
    const stop = () => animations.forEach(animation => animation.cancel());
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;
        if (entry.target === host && actor) {
          const distance = Math.max(0, host.clientWidth - actor.clientWidth);
          animations.push(actor.animate([{ translate: "0 0" }, { translate: `${distance}px 0` }, { translate: "0 0" }], { duration: mode === "travel" ? 6500 : 3200, iterations: mode === "travel" ? Infinity : 1, easing: "ease-in-out" }));
        } else if (entry.target !== host) {
          animations.push(entry.target.animate(mode === "curtain" ? [{ clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }] : [{ translate: "-24px 0", opacity: .65 }, { translate: "0 0", opacity: 1 }], { duration: 850, easing: "cubic-bezier(.22,1,.36,1)" }));
          if (actor) animations.push(actor.animate([{ rotate: "0deg" }, { rotate: "-12deg", offset: .35 }, { rotate: "0deg" }], { duration: 850 }));
        }
      }
    }, { threshold: .12 });
    observer.observe(host);
    section.querySelectorAll(targets).forEach(target => observer.observe(target));
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); stop(); preference.removeEventListener("change", stop); };
  }, [targets, mode]);
  return <div ref={lane} className={`mascot-reveal-lane mascot-reveal-${mode}`} aria-hidden="true"><div className="mascot-reveal-actor"><MascotCharacter state={mode === "curtain" ? "welcome" : "explaining"} /></div><span className="mascot-reveal-track" /></div>;
}