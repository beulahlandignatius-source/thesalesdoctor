import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "application/pdf"] as const;

/** Public: a visitor uploads a payment screenshot. Upload-only; nothing is read back. Not proof of payment. */
export const uploadPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({
      name: z.string().trim().min(1).max(120),
      email: z.string().trim().email().max(200),
      provider: z.enum(["stripe", "flutterwave"]),
      contentType: z.enum(TYPES),
      base64: z.string().min(10).max(7_000_000),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bytes.length > 5 * 1024 * 1024) throw new Error("File is larger than 5MB");
    const ext = (data.contentType.split("/")[1] ?? "bin").replace("jpeg", "jpg");
    const safe = data.email.toLowerCase().replace(/[^a-z0-9@._-]/g, "");
    const path = `${new Date().toISOString().slice(0, 10)}/${safe}-${data.provider}-${crypto.randomUUID()}.${ext}`;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.storage.from("payment-proofs").upload(path, bytes, { contentType: data.contentType });
    if (error) throw new Error("Could not upload your screenshot");
    return { ok: true };
  });
