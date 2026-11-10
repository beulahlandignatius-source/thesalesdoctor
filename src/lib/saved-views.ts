import { z } from "zod";

export const viewScope = z.enum(["enquiries", "payments"]);
export const viewFilters = z.object({
  q: z.string().max(200).optional(),
  kind: z.enum(["free_review", "private_clinic", "mentorship", ""]).optional(),
  status: z.enum(["", "new", "contacted", "booked", "paid", "closed", "pending", "verified", "rejected"]).optional(),
  provider: z.enum(["", "stripe", "flutterwave"]).optional(),
  from: z.string().date().optional(),
  to: z.string().date().optional(),
}).refine((v) => (!v.from && !v.to) || (!!v.from && !!v.to && v.from <= v.to), "Choose a valid date range");
export type ViewFilters = z.infer<typeof viewFilters>;
export const saveViewSchema = z.object({ scope: viewScope, name: z.string().trim().min(1).max(60), filters: viewFilters });
export const renameViewSchema = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(60) });