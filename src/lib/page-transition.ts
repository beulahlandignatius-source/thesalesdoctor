export type NavigationDirection = "forward" | "backward" | "neutral";

export const PAGE_TRANSITION = {
  duration: 320,
  revealDuration: 280,
  stagger: 30,
  maxStagger: 120,
  distance: 8,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export function navigationDirection(previous: number | undefined, next: number | undefined): NavigationDirection {
  if (previous === undefined || next === undefined || previous === next) return "neutral";
  return next > previous ? "forward" : "backward";
}