import { useState } from "react";
import { CheckCircle2, ImageUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { btnClass } from "@/components/site";
import { uploadPaymentProof } from "@/lib/payment-proof.functions";

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
    if (file.size > 5 * 1024 * 1024) return setError("Screenshot must be under 5MB.");
    setBusy(true); setError(null);
    try {
      await uploadPaymentProof({ data: { name: who.name, email: who.email, provider, contentType: (file.type || "image/jpeg") as any, base64: await toBase64(file) } });
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
          <DialogDescription>Upload a screenshot of your payment, then tap Paid to choose your slot.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {(["stripe", "flutterwave"] as const).map((p) => (
            <button key={p} type="button" onClick={() => setProvider(p)} aria-pressed={provider === p}
              className={`rounded-xl border p-3 text-sm font-semibold ${provider === p ? "border-primary bg-secondary text-primary" : "border-border"}`}>
              {p === "stripe" ? "Stripe · USD" : "Flutterwave · NGN"}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center hover:border-primary">
          <ImageUp className="h-6 w-6 text-primary" />
          <span className="text-sm font-medium">{file ? file.name : "Tap to add your payment screenshot"}</span>
          <span className="text-xs text-muted-foreground">PNG, JPG, WEBP or PDF · max 5MB</span>
          <input type="file" accept="image/png,image/jpeg,image/webp,image/heic,application/pdf" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button onClick={submit} disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "UPLOADING…" : "PAID →"}</Button>
      </DialogContent>
    </Dialog>
  );
}
