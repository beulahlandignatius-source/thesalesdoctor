import { QUESTIONS, OPTIONAL_IDS } from "./audit";

type AuditPage = { title: string; description: string; ids: string[] };
export const AUDIT_PAGES: [AuditPage, ...AuditPage[]] = [
  { title: "About You", description: "Your personal information and contact details.", ids: [] },
  { title: "Your Business & Market", description: "What you sell, who you serve and how well you understand your market.", ids: ["q1", "q2", "q3", "q6", "q7", "q8"] },
  { title: "Positioning & Offer", description: "How people understand your business and the value of your offer.", ids: ["q9", "q10", "q11", "q12", "q13", "q14"] },
  { title: "Marketing & Visibility", description: "Where potential clients discover you and how you attract them.", ids: ["q16", "q17", "q18", "q19"] },
  { title: "Sales & Follow-up", description: "Sales conversations, buying obstacles and the next steps for your leads.", ids: ["q15", "q20", "q21", "q22", "q23", "q24", "q25", "q26"] },
  { title: "Revenue & Targets", description: "Client value, growth targets and your recent business numbers.", ids: ["q4", "q5", "q27", "q28", "q29"] },
];

export const questionsForPage = (page: number) => (AUDIT_PAGES[page]?.ids ?? []).flatMap(id => {
  const question = QUESTIONS.find(q => q.id === id);
  return question ? [question] : [];
});

// Keep stored steps in the original question-index namespace for old sessions.
export const pageForStep = (step: number) => step <= 0 ? 0 : Math.max(1, AUDIT_PAGES.findIndex(page => page.ids.includes(QUESTIONS[Math.min(step, QUESTIONS.length) - 1]?.id ?? "")));
export const stepForPage = (page: number) => page === 0 ? 0 : QUESTIONS.findIndex(q => q.id === AUDIT_PAGES[page]?.ids[0]) + 1;
export const pageAnswersValid = (page: number, answers: Record<string, string>) => questionsForPage(page).every(q => OPTIONAL_IDS.has(q.id) || !!answers[q.id]?.trim());