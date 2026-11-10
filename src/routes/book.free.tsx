import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { F, FormShell, Options, StuckPicker, field, privacy } from "@/components/form-bits";
import { ExtLink, btnClass } from "@/components/site";
import { TARGETS, calendlyUrl } from "@/lib/links";

export const Route = createFileRoute("/book/free")({
  head: () => ({
    meta: [
      { title: "Book your free Client Acquisition Review — The Sales Clinic" },
      { name: "description", content: "A focused 25 minutes with Dr. Dan on your goals, what’s working and your biggest opportunity to grow." },
      { property: "og:title", content: "Free Client Acquisition Review — The Sales Clinic" },
      { property: "og:description", content: "A focused 25 minutes on your goals and your biggest opportunity to grow." },
    ],
  }),
  component: Free,
});

function Free() {
  const [done, setDone] = useState<string | null>(null);
  return (
    <FormShell eyebrow="Free · 25 minutes" title="Book your free Client Acquisition Review"
      intro="A focused 25 minutes on your goals, what’s working, what’s holding you back, and your biggest opportunity to grow."
      steps={["Tell me about your business (about 2 minutes).", "Pick a time that works for you.", "Show up. We’ll find what’s in the way."]}>
      {done ? (
        <div className="py-8 text-center">
          <h2 className="text-2xl font-extrabold">Now pick your time.</h2>
          <p className="mt-2 text-muted-foreground">Your calendar opened in a new tab. If it didn’t, use the button below.</p>
          <ExtLink href={done} className="mt-6">CHOOSE MY TIME ON CALENDLY →</ExtLink>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const url = calendlyUrl(String(d.get("name")), String(d.get("email")));
          window.open(url, "_blank", "noopener");
          setDone(url);
        }}>
          <F label="Full name"><input name="name" required className={field} /></F>
          <F label="Email address"><input name="email" type="email" required className={field} /></F>
          <F label="WhatsApp number"><input name="phone" type="tel" required placeholder="+234…" className={field} /></F>
          <F label="Business or brand name"><input name="business" required className={field} /></F>
          <F label="What do you sell?"><input name="sell" required className={field} /></F>
          <Options name="target" label="What target are you working toward?" options={TARGETS} placeholder="Select your next target" />
          <StuckPicker label="Where are you getting stuck? (choose as many as apply)" />
          <F label="Anything else I should know? (optional)"><input name="notes" placeholder="One line is enough" className={field} /></F>
          <F label="Website or LinkedIn (optional)"><input name="site" placeholder="https://" className={field} /></F>
          <button type="submit" className={btnClass("primary", "md", "w-full")}>BOOK MY FREE REVIEW →</button>
          {privacy}
        </form>
      )}
    </FormShell>
  );
}
