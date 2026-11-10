import { useEffect, useRef, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { navigationDirection, PAGE_TRANSITION } from "@/lib/page-transition";

/** Animate committed content only: never delay navigation or remount route state. */
export function PageTransition({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const previous = useRef<{ path: string; index: number | undefined } | null>(null);
  const location = useRouterState({ select: state => state.resolvedLocation ?? state.location });
  const path = location.pathname;
  const index = location.state.__TSR_index;

  useEffect(() => {
    const element = host.current;
    if (!element || previous.current?.path === path) return;
    const direction = navigationDirection(previous.current?.index, index);
    previous.current = { path, index };
    element.dataset["navigationDirection"] = direction;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animations: Animation[] = [];
    const frame = requestAnimationFrame(() => {
      // No zero-opacity frames, exit wait, loading overlay or transformed page container.
      animations.push(element.animate([{ opacity: .88 }, { opacity: 1 }], {
        duration: PAGE_TRANSITION.duration, easing: PAGE_TRANSITION.easing,
      }));
      const offset = direction === "backward" ? -PAGE_TRANSITION.distance : direction === "forward" ? PAGE_TRANSITION.distance : 0;
      const candidates = Array.from(element.querySelectorAll<HTMLElement>("h1, main > section > h2, main > section > p, .studio-content h2, .studio-content p, main > section > figure"))
        .filter(node => { const rect = node.getBoundingClientRect(); return rect.width > 0 && rect.bottom > 0 && rect.top < window.innerHeight; })
        .slice(0, 8);
      candidates.forEach((node, order) => {
        animations.push(node.animate([
          { opacity: .75, translate: `${offset}px 6px` },
          { opacity: 1, translate: "0px 0px" },
        ], {
          duration: PAGE_TRANSITION.revealDuration,
          delay: Math.min(order * PAGE_TRANSITION.stagger, PAGE_TRANSITION.maxStagger),
          easing: PAGE_TRANSITION.easing,
        }));
      });
    });
    return () => { cancelAnimationFrame(frame); animations.forEach(animation => animation.cancel()); };
  }, [path, index]);

  return <div ref={host} className="page-transition">{children}</div>;
}