import { reviewHeadshots } from "./review-headshots";

export const existingTestimonials = [
  ["“In one session Dr. Dan showed me exactly where my deals were leaking. I fixed my follow-up and closed two retainers the next month.”", "Adaeze N.", "Founder, brand studio"],
  ["“I’d never landed a paying client on my own. Three weeks into the mentorship I signed my first one, and I knew exactly how I did it.”", "Tobi A.", "Freelance designer, Nigeria"],
  ["“We rebuilt our outreach and offer together. That system brought in our biggest contract yet.”", "Michael O.", "Director, B2B consultancy"],
  ["“The clinic gave me a simple script for discovery calls. My close rate went from guessing to predictable.”", "Funmi B.", "Owner, skincare brand"],
  ["“I was undercharging for years. Dr. Dan helped me reprice my offer and I doubled my monthly revenue.”", "Chidi E.", "Web developer, Lagos"],
  ["“Clear, direct and practical. I left the session with a plan I started using that same afternoon.”", "Sarah K.", "Business coach, UK"],
  ["“My pipeline used to dry up every quarter. Now I have a weekly outreach rhythm that keeps leads coming.”", "Ibrahim S.", "Founder, logistics startup"],
  ["“The Client X-Ray showed me exactly why prospects ghosted me. Fixing my follow-up changed everything.”", "Ngozi O.", "Interior designer"],
  ["“Worth every cent of the $53. I recovered three stalled deals within two weeks.”", "David M.", "Consultant, Ghana"],
  ["“Dr. Dan doesn’t do fluff. He diagnosed my sales problem in minutes and gave me the cure.”", "Amaka U.", "Fashion entrepreneur"],
  ["“The mentorship gave me confidence on calls. I signed my first international client last month.”", "Kelechi I.", "Copywriter"],
  ["“We finally have a sales process the whole team can follow. Revenue is up and stress is down.”", "Grace T.", "Co-founder, digital agency"],
  ["“I booked the free review expecting tips. I got a full roadmap for landing better clients.”", "Emeka J.", "Photographer, Abuja"],
].map((review, index) => [...review, reviewHeadshots[index]?.url]);
