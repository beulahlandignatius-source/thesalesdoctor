const styles: Record<string, string> = {
  LOW: "border border-border bg-background text-muted-foreground",
  MODERATE: "border border-secondary bg-secondary/40 text-secondary-foreground",
  HIGH: "border border-primary/40 bg-primary/10 text-primary",
  CRITICAL: "border border-primary bg-primary text-primary-foreground",
};

export function SeverityBadge({ value }: { value: string | null }) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold tracking-widest ${styles[value] ?? styles["LOW"]}`}>{value}</span>;
}

export const DIAGNOSIS_OPTIONS = [
  ["empty_pipeline", "The Empty Pipeline"],
  ["invisible_expert", "The Invisible Expert"],
  ["weak_offer", "The Weak Offer"],
  ["wrong_room", "The Wrong Room"],
  ["leaking_sales_process", "The Leaking Sales Process"],
  ["lead_graveyard", "The Lead Graveyard"],
] as const;

export const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—");
