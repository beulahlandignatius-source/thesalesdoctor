import { describe, expect, it } from "vitest";
import { reviewSchema } from "@/lib/reviews";

const review = { name: "Visitor", role: "Founder", rating: 5, body: "A thoughtful, focused session.", consent: true };
describe("Visitor reviews", () => {
  it("accepts a visitor's review without requiring an account", () => {
    expect(reviewSchema.parse(review).name).toBe("Visitor");
  });
  it("requires permission to publish a review", () => {
    expect(reviewSchema.safeParse({ ...review, consent: false }).success).toBe(false);
  });
  it("only accepts whole star ratings from 1 to 5", () => {
    for (const rating of [0, 6, 2.5]) expect(reviewSchema.safeParse({ ...review, rating }).success).toBe(false);
    for (const rating of [1, 5]) expect(reviewSchema.safeParse({ ...review, rating }).success).toBe(true);
  });
  it("rejects bot-filled hidden fields", () => {
    expect(reviewSchema.safeParse({ ...review, website: "spam" }).success).toBe(false);
  });
});