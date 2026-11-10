export const KIND_LABEL: Record<string, string> = {
  free_review: "Free review",
  private_clinic: "Private Sales Clinic",
  mentorship: "Mentorship",
};

export const DETAIL_LABEL: Record<string, string> = {
  business: "Business or brand",
  sell: "What they sell",
  revenue: "Current monthly revenue",
  target: "Next target",
  stuck: "Stuck on / wants to work through",
  notes: "Anything else",
  site: "Website or LinkedIn",
  role: "What they do",
  goal: "Trying to achieve",
  why: "Why mentorship",
};

export const fmt = (d: string) =>
  new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
