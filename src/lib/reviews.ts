import { z } from "zod";

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  role: z.string().trim().max(120).default(""),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().min(10, "Please write at least 10 characters").max(1500),
  consent: z.literal(true, { message: "Please agree to publish your review" }),
  website: z.string().max(0).default(""),
});
export type PublicReview = { id: string; name: string; role: string; rating: number; body: string };