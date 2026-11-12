import blushJacket from "@/assets/dr-dan-blush-jacket.jpg";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { F, FormError, FormShell, field, privacy, useEnquiry } from "@/components/form-bits";
import { ExtLink, btnClass } from "@/components/site";
import { LINKS } from "@/lib/links";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title: "Become my mentee | Dr. Dan, The Sales Clinic" },
      { name: "description", content: "Work directly with Dr. Dan until winning clients is a skill you own." },
      { property: "og:title", content: "Become Dr. Dan’s mentee | The Sales Clinic" },
      { property: "og:description", content: "Tell me where you are and where you want to go." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Mentor,
});

function Mentor() {
  const [sent, setSent] = useState(false);
  const { save, busy, error } = useEnquiry("mentorship");
  return (
    <div className="mentorship-enquiry">
      <figure className="mentor-portrait mx-auto max-w-3xl px-5 pt-6"><div className="mentor-portrait-frame"><img src={blushJacket} alt="Dr. Dan Odotukpono standing in a pale red jacket, smiling" className="h-full w-full object-cover" /></div></figure>
      <FormShell title="Become my mentee"
      intro="Tell me where you are and where you want to go. If we’re a fit, I’ll work with you directly until winning clients is a skill you own."
      steps={["Tell me about you and your goals.", "We have a short conversation on WhatsApp.", "If it’s a fit, we get to work."]}>
      {sent ? (
        <div className="py-8 text-center">
          <h2 className="text-2xl font-extrabold">Your enquiry is in.</h2>
          <p className="mt-2 text-muted-foreground">Next, say hello to Dr. Dan on WhatsApp so we can have a short conversation.</p>
          <ExtLink href={LINKS.whatsapp} className="mt-6">CONTINUE TO WHATSAPP →</ExtLink>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={async (e) => {
          e.preventDefault();
          if (await save(e.currentTarget)) { setSent(true); window.location.assign(LINKS.whatsapp); }
        }}>
          <div className="form-contact grid gap-5 sm:grid-cols-2">
          <F compact label="Full name"><input name="name" required autoComplete="name" className={field} /></F>
          <F compact label="Email address"><input name="email" type="email" required autoComplete="email" className={field} /></F>
          <F compact label="WhatsApp number"><input name="phone" type="tel" required autoComplete="tel" placeholder="+234…" className={field} /></F>
          </div>
          <F compact label="What do you currently do?"><input name="role" required placeholder="e.g. coach, consultant, freelancer" className={field} /></F>
          <F compact label="What are you trying to achieve?"><input name="goal" required className={field} /></F>
          <FormError msg={error} />
          <Button type="submit" disabled={busy} className={btnClass("primary", "md", "w-full")}>{busy ? "SAVING…" : "SEND MY ENQUIRY →"}</Button>
          <p className="text-center text-sm text-muted-foreground">Next you’ll continue to WhatsApp to message Dr. Dan directly.</p>
          {privacy}
        </form>
      )}
    </FormShell></div>
  );
}
