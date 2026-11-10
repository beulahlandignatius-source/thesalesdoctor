import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { F, FormError, FormShell, Options, StuckPicker, field, privacy, useEnquiry } from "@/components/form-bits";
import { btnClass } from "@/components/site";
import { TARGETS } from "@/lib/links";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book/free")({
  head: () => ({
    meta: [
      { title: "Book your free Client Acquisition Review — The Sales Clinic" },
      { name: "description", content: "A focused 25 minutes with Dr. Dan on your goals, what’s working and your biggest opportunity to grow." },
      { property: "og:title", content: "Free Client Acquisition Review — The Sales Clinic" },
      { property: "og:description", content: "A focused 25 minutes on your goals and your biggest opportunity to grow." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Free,
});

function Free() {
  const navigate = useNavigate();
  const { save, busy, error } = useEnquiry("free_review");
  return (
    <FormShell eyebrow="Free · 25 minutes" title="Book your free Client Acquisition Review"
      intro="A focused 25 minutes on your goals, what’s working, what’s holding you back, and your biggest opportunity to grow."
      steps={["Tell me about your business (about 2 minutes).", "Pick a time that works for you.", "Show up. We’ll find what’s in the way."]}>
      {(
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          const who = await save(e.currentTarget);
          if (who) navigate({ to: "/book/schedule", search: { session: "free", name: who.name, email: who.email } });
        }}>
          <div className="form-contact grid gap-5 sm:grid-cols-2">
          <F label="Full name"><input name="name" required autoComplete="name" className={field} /></F>
          <F label="Email address"><input name="email" type="email" required autoComplete="email" className={field} /></F>
          <F label="WhatsApp number"><input name="phone" type="tel" required autoComplete="tel" placeholder="+234…" className={field} /></F>
          </div>
          <F label="Business or brand name"><input name="business" required className={field} /></F>
          <F label="What do you sell?"><input name="sell" required className={field} /></F>
          <Options name="target" label="What target are you working toward?" options={TARGETS} placeholder="Select your next target" />
          <StuckPicker label="Where are you getting stuck? (choose as many as apply)" />
          <F label="Anything else I should know? (optional)"><input name="notes" placeholder="One line is enough" className={field} /></F>
          <F label="Website or LinkedIn (optional)"><input name="site" placeholder="https://" className={field} /></F>
          <FormError msg={error} />
          <Button type="submit" disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "SAVING…" : "BOOK MY FREE REVIEW →"}</Button>
          {privacy}
        </form>
      )}
    </FormShell>
  );
}
