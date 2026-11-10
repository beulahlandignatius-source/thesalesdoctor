export const GUIDE_QUESTIONS = [
  { text: "What's your biggest sales challenge right now?", options: ["Getting customers", "Converting leads", "Closing sales", "Growing revenue", "Building a sales strategy"] },
  { text: "Who are you trying to sell to?", options: ["Individuals", "Small businesses", "Startups", "Large businesses", "Other"] },
  { text: "What's your biggest goal?", options: ["Increase sales", "Improve conversions", "Build a sales system", "Grow my business", "Get expert mentorship"] },
] as const;

export type CompanionDestination = "/book" | "/book/free" | "/book/clinic" | "/mentorship" | "/services" | "/xray";
export type GuideSummary = { focus: string; guidance: string; destination: CompanionDestination; action: string };

export function summarizeGuide(answers: string[]): GuideSummary | null {
  if (answers.length !== 3 || answers.some(a => !a.trim())) return null;
  const [challenge = "", audience = "", goal = ""] = answers;
  const mentorship = /mentor/i.test(goal);
  const conversion = /convert|conversion|clos/i.test(challenge + " " + goal);
  const system = /strategy|system/i.test(challenge + " " + goal);
  return {
    focus: `You want to ${goal.toLowerCase()} while selling to ${audience.toLowerCase()}. Your main challenge is ${challenge.toLowerCase()}.`,
    guidance: mentorship
      ? "Mentorship is a relevant option to explore for direct support with your outreach, sales conversations, follow-up and offers."
      : conversion
        ? "A useful starting point is to review what happens between an interested lead, a sales conversation and follow-up. The Client Acquisition Review can help you examine this with Dr. Dan."
        : system
          ? "Start by looking at how people find you, understand your offer and move towards a decision. Explore the Private Sales Clinic for a focused working session on your process."
          : "Start by examining who you want to reach, the outcome you offer and how you start conversations with potential clients. The free Client Acquisition Review is an option to discuss where to focus.",
    destination: mentorship ? "/mentorship" : system && !conversion ? "/book/clinic" : "/book/free",
    action: mentorship ? "Explore mentorship" : system && !conversion ? "Explore the Private Sales Clinic" : "Explore the free review",
  };
}

// Intentionally deterministic. A future conversational provider can replace this adapter.
export function respondToMessage(message: string): { text: string; destination?: CompanionDestination; action?: string } {
  const text = message.trim().toLowerCase();
  if (/mentor/.test(text)) return { text: "Mentorship offers direct guidance on outreach, sales conversations, follow-up and offers. Explore the page to see whether it fits.", destination: "/mentorship", action: "Explore mentorship" };
  if (/price|cost|paid|private/.test(text)) return { text: "The Private Sales Clinic is $53 for a 90-minute working session. A free 25-minute Client Acquisition Review is also available.", destination: "/book", action: "Choose a session" };
  if (/book|consult|session/.test(text)) return { text: "Choose the free Client Acquisition Review or the Private Sales Clinic, then follow the existing booking steps.", destination: "/book", action: "Book a consultation" };
  if (/x.?ray|audit|diagnos/.test(text)) return { text: "For a fuller assessment of your client acquisition process, take the existing Client X-Ray. This short guide does not replace its diagnosis.", destination: "/xray", action: "Take the Client X-Ray" };
  if (/service|support|offer/.test(text)) return { text: "Explore the available support, including the Client Acquisition Review, Private Sales Clinic and mentorship.", destination: "/services", action: "Explore services" };
  if (/follow/.test(text)) return { text: "Your follow-up could be the difference between a lost lead and a sale. Review which interested leads have a clear next step.", destination: "/book/free", action: "Explore the free review" };
  if (/lead|customer|sales|revenue|convert|clos/.test(text)) return { text: "Understand the customer's problem before presenting your solution. Answer the three questions for a starting point based on your challenge, audience and goal." };
  return { text: "I can share predefined guidance about sessions, prices, mentorship, services, follow-up and the Client X-Ray. For personal advice, book time with Dr. Dan.", destination: "/book", action: "Book a consultation" };
}

export const SALES_TIPS = [
  "Stop selling features. Start selling outcomes.",
  "Your follow-up could be the difference between a lost lead and a sale.",
  "Understand the customer's problem before presenting your solution.",
  "More leads don't always mean more sales.",
];