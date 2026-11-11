export const CLINIC_BONUSES = [
  { title: "The Profile Prescription", description: "A step-by-step checklist and fill-in templates to turn your LinkedIn profile into a client magnet, so profile views become DMs.", price: 5 },
  { title: "The 30-Day Client Content Plan", description: "30 ready-to-use post prompts that build attention, trust and demand for your offer, so your content starts conversations, not just likes.", price: 5 },
  { title: "The Cold DM Pitch Template", description: "Proven pitch messages you can send to start conversations with ideal clients and turn them into paid work.", price: 7 },
  { title: "The Offer Rebuild Worksheet", description: "A one-page exercise to reshape your offer so it feels bigger, less risky and easier to say yes to.", price: 10 },
  { title: "The Follow-Up Script Pack", description: 'Ready-to-send WhatsApp, DM and email follow-ups for leads who went quiet. Day 1, 3, 7 and 14, plus a final "closing the loop" message.', price: null },
] as const;

export const CLINIC_BONUS_VALUE = CLINIC_BONUSES.reduce((total, bonus) => total + (bonus.price ?? 0), 0);