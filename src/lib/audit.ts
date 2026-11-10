export type Category = "market" | "positioning" | "offer" | "leadgen" | "sales" | "followup";

export type Question =
  | { id: string; section: string; text: string; type: "text"; placeholder?: string | undefined }
  | { id: string; section: string; text: string; type: "choice"; options: string[]; multi?: boolean }
  | { id: string; section: string; text: string; type: "scale"; category: Category; options: string[] };

const T = (id: string, section: string, text: string, placeholder?: string): Question => ({ id, section, text, type: "text", placeholder });
const C = (id: string, section: string, text: string, options: string[], multi = false): Question => ({ id, section, text, type: "choice", options, multi });
export const MULTI_SEP = "; ";
const S = (id: string, section: string, category: Category, text: string, options: string[]): Question => ({ id, section, text, type: "scale", category, options });

export const QUESTIONS: Question[] = [
  T("q1", "About your business", "What do you currently sell?", "e.g. Business coaching for startup founders"),
  T("q2", "About your business", "Who do you primarily sell to?", "e.g. First-time founders in Nigeria"),
  C("q3", "About your business", "How long have you been selling this?", ["Less than 3 months", "3–6 months", "6–12 months", "1–2 years", "2+ years"]),
  C("q4", "About your business", "What's your average client worth?", ["Under $250", "$250–500", "$500–1,000", "$1,000–3,000", "$3,000–10,000", "$10,000+"]),
  C("q5", "About your business", "How many new clients would you ideally like to get each month?", ["1–2", "3–5", "6–10", "11–20", "20+"]),

  S("q6", "Market", "market", "How clearly can you describe your ideal client?", ["I sell to almost anyone", "I have a general idea", "I can describe them reasonably well", "I know exactly who I want to work with", "I have a very specific ideal client and understand their needs"]),
  S("q7", "Market", "market", "How strongly does your ideal client genuinely need the problem you solve?", ["It's mostly a nice-to-have", "Some people care", "It's an important problem", "It's a significant problem", "It is urgent and expensive for them to ignore"]),
  S("q8", "Market", "market", "How often do you speak directly to people who could realistically buy from you?", ["Rarely", "A few times a month", "A few times a week", "Almost every day", "Every day and I have a consistent flow"]),

  S("q9", "Positioning", "positioning", "If someone visits your profile/page today, how quickly would they understand what you do?", ["They probably wouldn't", "It would take some explanation", "They'd understand generally", "They'd understand clearly", "They'd immediately know what I do, who I help and the result I provide"]),
  S("q10", "Positioning", "positioning", "How different are you from other people offering something similar?", ["I don't think I'm very different", "Mostly similar", "I have some differences", "I'm clearly differentiated", "My positioning makes me an obvious choice for a specific type of client"]),
  T("q11", "Positioning", "Why should someone choose you instead of another provider?"),

  S("q12", "Offer", "offer", "How clearly defined is your main offer?", ["I basically sell my time/skill", "I have a rough service", "I have a defined service", "I have a clearly packaged offer", "My offer is highly specific around a clear outcome"]),
  S("q13", "Offer", "offer", "How clearly can you explain the result a client gets?", ["I mostly explain what I do", "I explain some benefits", "I can explain the outcome", "The outcome is very clear", "The outcome is specific, measurable and easy to understand"]),
  S("q14", "Offer", "offer", "How confident are you that your offer is worth the price?", ["Not confident", "Somewhat confident", "Fairly confident", "Very confident", "Extremely confident"]),
  C("q15", "Offer", "What usually stops people from buying?", ["Price", "Trust", "Timing", "They don't see the value", "They need to think about it", "They disappear", "I don't know", "Something else"], true),

  C("q16", "Lead generation", "Where do most of your potential clients currently come from?", ["Content/social media", "Cold outreach", "Referrals", "Ads", "Networking/events", "Partnerships", "Existing audience/community", "Mostly random/inconsistent", "Other"], true),
  C("q17", "Lead generation", "How many genuine potential buyers do you currently get into conversations with in a typical month?", ["0–5", "6–10", "11–25", "26–50", "51–100", "100+"]),
  C("q18", "Lead generation", "What is your content primarily designed to do?", ["Educate", "Build trust/authority", "Generate leads", "Sell directly", "Get me viral", "A mixture", "I don't really have a content strategy"]),
  S("q19", "Lead generation", "leadgen", "How consistently are you actively looking for new clients?", ["Almost never", "Occasionally", "A few times a week", "Almost every day", "Every day with a defined process"]),

  S("q20", "Sales", "sales", "When someone shows interest, what normally happens next?", ["I usually just chat with them", "I send them information", "I ask a few questions", "I move them into a structured sales process", "I have a defined process from interest → conversation → close"]),
  S("q21", "Sales", "sales", "How confident are you running a sales conversation?", ["I avoid sales calls when possible", "I'm uncomfortable", "I'm okay at it", "I'm confident", "I'm very confident and have a repeatable process"]),
  S("q22", "Sales", "sales", "How well do you understand what the prospect actually needs before making your offer?", ["I mostly pitch quickly", "I ask a few questions", "I do some discovery", "I have a structured discovery process", "I deeply understand their problem, desired outcome and buying situation before presenting"]),
  S("q23", "Sales", "sales", "When someone says \u201cI'll think about it\u201d, what normally happens?", ["I leave it alone", "I send one follow-up", "I follow up a few times", "I have a structured follow-up process", "I know how to handle objections and move the conversation forward"]),

  C("q24", "Follow-up", "How many people who have shown interest are currently sitting in your DMs, email or CRM without a clear next step?", ["Almost none", "A few", "Quite a few", "A lot", "Honestly, I have no idea"]),
  S("q25", "Follow-up", "followup", "How consistently do you follow up with people who don't buy immediately?", ["Almost never", "Once", "A few times", "Consistently", "I have a defined follow-up sequence"]),
  S("q26", "Follow-up", "followup", "Do you actively revisit old leads who didn't buy?", ["Never", "Rarely", "Sometimes", "Regularly", "Yes, I have a system for it"]),

  C("q27", "Optional numbers", "Approximately how many sales conversations did you have last month?", ["0", "1–5", "6–10", "11–25", "26–50", "50+", "I don't track this"]),
  C("q28", "Optional numbers", "Approximately how many clients did you close last month?", ["0", "1", "2–3", "4–5", "6–10", "10+", "I don't track this"]),
  C("q29", "Optional numbers", "How much revenue did those new clients generate?", ["$0", "Under $1,000", "$1,000–3,000", "$3,000–10,000", "$10,000+", "I don't track this"]),
];

export const OPTIONAL_IDS = new Set(["q27", "q28", "q29"]);

export type BasicInfo = { name: string; email: string; whatsapp: string };
export type SessionRef = { id: string; token: string };
export type AuditState = { step: number; info: BasicInfo; answers: Record<string, string>; session?: SessionRef };
export type Scores = Record<Category, number | null>;

const KEY = "client-xray-v2";
export const emptyState = (): AuditState => ({ step: 0, info: { name: "", email: "", whatsapp: "" }, answers: {} });
export function loadState(): AuditState {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...emptyState(), ...JSON.parse(raw) }; } catch {}
  return emptyState();
}
export const saveState = (s: AuditState) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
export const clearState = () => { try { localStorage.removeItem(KEY); } catch {} };

/** Deterministic scoring: average of 1–5 answers per category ÷ 5 × 100. */
export function calculateScores(answers: Record<string, string>): Scores {
  const buckets: Record<Category, number[]> = { market: [], positioning: [], offer: [], leadgen: [], sales: [], followup: [] };
  for (const q of QUESTIONS) {
    if (q.type !== "scale") continue;
    const i = q.options.indexOf(answers[q.id] ?? "");
    if (i >= 0) buckets[q.category].push(i + 1);
  }
  const out = {} as Scores;
  for (const k of Object.keys(buckets) as Category[]) {
    const v = buckets[k];
    out[k] = v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length / 5) * 100) : null;
  }
  return out;
}
