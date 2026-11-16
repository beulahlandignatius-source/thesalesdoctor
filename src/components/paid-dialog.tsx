import { useState } from "react";
import { CheckCircle2, ExternalLink, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { btnClass } from "@/components/site";
import { uploadPaymentProof } from "@/lib/payment-proof.functions";
import { LINKS } from "@/lib/links";

const PAYMENT_FILE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/heic", "application/pdf"] as const;
type PaymentFileType = typeof PAYMENT_FILE_TYPES[number];
function isPaymentFileType(type: string): type is PaymentFileType {
  return PAYMENT_FILE_TYPES.some((allowed) => allowed === type);
}

const toBase64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(",")[1] ?? "");
  r.onerror = () => rej(r.error);
  r.readAsDataURL(f);
});

export function PaidDialog({ who, onDone }: { who: { name: string; email: string }; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<"stripe" | "flutterwave">("stripe");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!file) return setError("Please add a screenshot of your payment.");
    if (file && file.size > 5 * 1024 * 1024) return setError("Screenshot must be under 5MB.");
    if (file && !isPaymentFileType(file.type)) return setError("Choose a PNG, JPG, WEBP, HEIC or PDF file.");
    setBusy(true);
    setError(null);
    try {
      await uploadPaymentProof({ data: { name: who.name, email: who.email, provider, contentType: file.type, base64: await toBase64(file) } });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={btnClass("primary", "md", "mt-4 w-full")}><CheckCircle2 className="h-4 w-4" /> I’VE PAID</Button>
      </DialogTrigger>
      <DialogContent className="rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle>Confirm your payment</DialogTitle>
          <DialogDescription>Choose the provider you paid with, add your payment screenshot, then continue to choose your slot. Payment is verified with the provider.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {(["stripe", "flutterwave"] as const).map((p) => (
            <div key={p} className={`min-w-0 rounded-xl border p-3 ${provider === p ? "border-primary bg-secondary" : "border-border"}`}>
              <Button type="button" variant="ghost" onClick={() => setProvider(p)} aria-pressed={provider === p}
                className="!h-auto min-h-11 w-full !justify-between !whitespace-normal !px-0 !py-1 text-left text-sm font-semibold text-foreground hover:bg-transparent hover:text-foreground">
                <span>{p === "stripe" ? "Stripe · USD" : "Flutterwave · NGN"}</span>
                {provider === p && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-label="Selected" />}
              </Button>
              <a href={p === "stripe" ? LINKS.stripe : LINKS.flutterwave} target="_blank" rel="noopener noreferrer"
                onClick={() => { setProvider(p); window.__lovableEvents?.track?.("project.payment_started", { provider: p }); }}
                className="mt-2 inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-4">
                Open payment link <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center hover:border-primary">
          <ImageUp className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">{file ? file.name : "Tap to add your payment screenshot"}</span>
          <span className="text-xs text-muted-foreground">PNG, JPG, WEBP or PDF · max 5MB</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/heic,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <p className="text-xs leading-relaxed text-muted-foreground">Your screenshot helps the team review your submission. It does not confirm payment; payment is verified with Stripe or Flutterwave.</p>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button onClick={submit} disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "UPLOADING…" : "UPLOAD & CONTINUE TO BOOKING →"}</Button>
      </DialogContent>
    </Dialog>
  );
}
