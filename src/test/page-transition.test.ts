import { describe, expect, it } from "vitest";
import { navigationDirection, PAGE_TRANSITION } from "@/lib/page-transition";

describe("page transition rules", () => {
  it("moves backward when browser history goes to an earlier entry", () => {
    expect(navigationDirection(4, 3)).toBe("backward");
  });
  it("moves forward for both new entries and browser forward", () => {
    expect(navigationDirection(3, 4)).toBe("forward");
  });
  it("uses neutral movement for first loads and replaced entries", () => {
    expect(navigationDirection(undefined, 0)).toBe("neutral");
    expect(navigationDirection(4, 4)).toBe("neutral");
  });
  it("keeps page motion and the full stagger within 250–450ms", () => {
    expect(PAGE_TRANSITION.duration).toBeGreaterThanOrEqual(250);
    expect(PAGE_TRANSITION.duration).toBeLessThanOrEqual(450);
    expect(PAGE_TRANSITION.revealDuration).toBeGreaterThanOrEqual(250);
    expect(PAGE_TRANSITION.revealDuration + PAGE_TRANSITION.maxStagger).toBeLessThanOrEqual(450);
  });
});