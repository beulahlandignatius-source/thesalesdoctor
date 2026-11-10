import { createFileRoute } from "@tanstack/react-router";
import { F, FormShell, field, privacy } from "@/components/form-bits";
import { btnClass } from "@/components/site";
import { LINKS } from "@/lib/links";

export const Route = createFileRoute("/mentorship")({
  head: () => ({
    meta: [
      { title: "Become my mentee — Dr. Dan, The Sales Clinic" },
      { name: "description", content: "Work directly with Dr. Dan until winning clients is a skill you own." },
      { property: "og:title", content: "Become Dr. Dan’s mentee — The Sales Clinic" },
      { property: "og:description", content: "Tell me where you are and where you want to go." },
    ],
  }),
  component: Mentor,
});

function Mentor() {
  return (
    <FormShell title="Become my mentee"
      intro="Tell me where you are and where you want to go. If we’re a fit, I’ll work with you directly until winning clients is a skill you own."
      steps={["Tell me about you and your goals.", "We have a short conversation on WhatsApp.", "If it’s a fit, we get to work."]}>
      <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); window.open(LINKS.whatsapp, "_blank", "noopener"); }}>
        <F label="Full name"><input name="name" required className={field} /></F>
        <F label="Email address"><input name="email" type="email" required className={field} /></F>
        <F label="WhatsApp number"><input name="phone" type="tel" required placeholder="+234…" className={field} /></F>
        <F label="What do you currently do?"><input name="role" required placeholder="e.g. coach, consultant, freelancer" className={field} /></F>
        <F label="What are you trying to achieve?"><textarea name="goal" required rows={3} className={field} /></F>
        <F label="Why do you want to be mentored?"><textarea name="why" required rows={3} className={field} /></F>
        <button type="submit" className={btnClass("primary", "md", "w-full")}>SEND MY ENQUIRY ON WHATSAPP →</button>
        <p className="text-center text-sm text-muted-foreground">This opens WhatsApp so you can message Dr. Dan directly.</p>
        {privacy}
      </form>
    </FormShell>
  );
}
