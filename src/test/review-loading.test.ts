import { describe, expect, it, vi } from "vitest";
import { loadReviewsSafely, type PublicReview } from "@/lib/reviews";

const review: PublicReview = {
  id: "review-1",
  name: "Client",
  role: "Founder",
  rating: 5,
  body: "The session gave me a clear plan.",
  photoUrl: null,
  screenshotUrl: null,
};

describe("safe public review loading", () => {
  it("shows an empty state instead of failing the page when review loading fails", async () => {
    await expect(loadReviewsSafely(() => Promise.reject(new Error("Reviews unavailable")))).resolves.toEqual([]);
  });

  it("preserves reviews when loading succeeds", async () => {
    const load = vi.fn().mockResolvedValue([review]);
    await expect(loadReviewsSafely(load)).resolves.toEqual([review]);
  });
});