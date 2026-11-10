import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/logo-transparent.png";
import { loadState } from "@/lib/audit";
import { buildBookingUrl } from "@/lib/booking";

export const Route = createFileRoute("/xray/book")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Book Your Client Acquisition Review — The Sales Doctor" },
      {
        name: "description",
        content: "Pick a time for your Client Acquisition Review with Dr. Dan.",
      },
      { property: "og:title", content: "Book Your Client Acquisition Review with Dr. Dan" },
      {
        property: "og:description",
        content: "Choose a time that suits you. Your X-Ray details come with you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Book,
});

function Book() {
  const [src, setSrc] = useState<string | null>(null);
  const [diag, setDiag] = useState<{ title: string; severity: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const s = loadState();
    let title = "",
      severity = "";
    try {
      const r = JSON.parse(localStorage.getItem("client-xray-diagnosis") ?? "null");
      if (r) {
        title = r.diagnosis_title;
        severity = r.severity;
        setDiag({ title, severity });
      }
    } catch {}
    const url = buildBookingUrl({
      name: s.info.name,
      email: s.info.email,
      business: s.answers["q1"] ?? "",
      diagnosis: title,
      severity,
    });
    if (url) {
      const u = new URL(url);
      u.searchParams.set("embed_domain", window.location.hostname);
      u.searchParams.set("embed_type", "Inline");
      u.searchParams.set("hide_gdpr_banner", "1");
      setSrc(u.toString());
    }
  }, []);

  return (
    <div className="min-h-dvh bg-background px-4 pb-10 pt-5">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between pr-14">
          <Link
            to="/results"
            className="inline-flex min-h-11 items-center text-sm text-muted-foreground"
          >
            ← Back to my X-Ray
          </Link>
          <img src={logo} alt="The Sales Doctor" className="w-16" />
        </header>

        <div className="mt-6 text-center">
          <p className="eyebrow">Client Acquisition Review with Dr. Dan</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-foreground">Choose a time</h1>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Your details and X-Ray result are already filled in, so you only need to pick a slot.
          </p>
          {diag && (
            <p className="mt-4 inline-block rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground">
              {diag.title} · <span className="font-semibold text-primary">{diag.severity}</span>
            </p>
          )}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-lg border border-border bg-card">
          {!loaded && src && (
            <div
              role="status"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span className="sr-only">Loading appointment calendar…</span>
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
          )}
          {src ? (
            <iframe
              title="Book with Dr. Dan"
              src={src}
              onLoad={() => setLoaded(true)}
              className="h-[1000px] w-full md:h-[720px]"
            />
          ) : (
            <p className="p-8 text-center text-muted-foreground">
              Booking isn't available right now. Please try again shortly.
            </p>
          )}
        </div>

        {src && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Calendar not loading?{" "}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Open it in a new tab
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
