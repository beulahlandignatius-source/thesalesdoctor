export const LINKS = {
  calendly: "https://calendly.com/thesalesdoctor2/thesalesclinic",
  stripe: "https://buy.stripe.com/9B600lb5Vgslcake8y2ZO0L",
  flutterwave: "https://flutterwave.com/pay/kyqfrin1z57j",
  whatsapp: "https://wa.link/ez0syb",
  linkedin: "https://www.linkedin.com/in/the-salesdoctor",
} as const;

export const CLINIC_PRICE = "$53";
export const CLINIC_TERMS = "One-time payment, made before you choose your slot";

export const TARGETS = [
  "Land my first or next client",
  "$1K a month",
  "$5K a month",
  "$10K a month",
  "$50K a month",
  "$100K+ a month",
];

export const REVENUE = [
  "Nothing yet, or very inconsistent",
  "Under $500",
  "$500–$1K",
  "$1K–$5K",
  "$5K–$10K",
  "$10K–$50K",
  "$50K–$100K",
  "$100K+",
  "Prefer not to say",
];

export const STUCK = [
  "Standing out from competitors",
  "Creating content that attracts clients",
  "Building a funnel that converts",
  "Running campaigns and launches",
  "Getting more leads",
  "Doing outreach that gets replies",
  "Turning leads into clients",
  "Closing on sales calls",
  "Following up consistently",
  "Fixing my offer or pricing",
  "Scaling past where I am now",
  "Figuring out what’s not working",
];

export function calendlyUrl(name?: string, email?: string) {
  const u = new URL(LINKS.calendly);
  if (name) u.searchParams.set("name", name);
  if (email) u.searchParams.set("email", email);
  return u.toString();
}
