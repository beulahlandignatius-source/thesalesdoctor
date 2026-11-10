# Sales Clinic redesign content audit

The original HTML is not available in this remix's attached uploads or project files. Preserve the existing implementation; do not claim an original-HTML comparison. Current testimonials and payment terms were drafted previously and still need owner confirmation, not replacement during this visual task.

## Existing home page order
1. Hero: original revenue-target question, Dr. Dan attribution, supporting paragraph, consultation CTA, free-option note, portrait, three statistics.
2. Your session: three questions and their explanations.
3. Who this is for: headline, four quoted challenges and explanations, next-step CTA.
4. How it works: headline and three booking steps.
5. Mentorship: introduction, desk portrait/quote, four benefits, mentorship CTA, done-for-you note and consultation CTA.
6. Proof: three statistics and all three current testimonials/attributions.
7. Philosophy: introduction, three principles, standing portrait.
8. Closing: target headline, supporting paragraph, consultation CTA.
9. Shared footer: all existing links, copyright/name, past-results disclaimer.

## Navigation
Keep Home, Sessions, Client X-Ray, Mentorship and consultation CTA. Add Services with an empty /services destination. Keep separate admin navigation unchanged.

## Separate customer journeys
- /book: compare free 25-minute review and paid 90-minute clinic; all existing descriptions, benefits, $53 price and comparison labels.
- /book/free: introduction and three steps; name, email, WhatsApp, business, offer, target, multi-select challenges, optional notes and website; saves enquiry before Calendly continuation with prefilled name/email.
- /book/clinic: introduction and three steps; name, email, WhatsApp, business, offer/audience, revenue, target, multi-select challenges, optional notes; price/terms; saves before Stripe/Flutterwave choices and Calendly continuation. No payment success claim.
- /mentorship: introduction and three steps; name, email, WhatsApp, current role, goal and motivation; saves before WhatsApp continuation.
- All forms retain existing privacy wording, saving state and retry error state. Existing analytics remain unchanged.
- Imported /xray, /audit, /results and admin workflows retain their content and logic; only shared navigation/design tokens affect them.