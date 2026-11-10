import { z } from "zod";

export const adminSearchSchema = z.object({ query: z.string().trim().min(2).max(120) });
export function searchPattern(query: string) {
  // Quote PostgREST values and escape LIKE wildcards: user input is literal text.
  return `"%${query.replace(/\\/g, "\\\\").replace(/[%_]/g, "\\$&").replace(/"/g, '\\"')}%"`;
}
export type AdminSearchResult = {
  id: string;
  type: "enquiry" | "payment" | "screenshot" | "review";
  title: string;
  subtitle: string;
  status: string;
  date: string;
  details?: { reference: string; provider: string; amount: number; currency: string };
};