import { useState } from "react";

export function CalendlyEmbed({ src, onOpen }: { src: string; onOpen?: () => void }) {
  const [loaded, setLoaded] = useState(false);
  const url = new URL(src);
  url.searchParams.set("hide_gdpr_banner", "1");
  return (
    <div className="mt-5">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card">
        {!loaded && (
          <div role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="sr-only">Loading appointment calendar…</span>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        )}
        <iframe title="Book with Dr. Dan" src={url.toString()} onLoad={() => { setLoaded(true); onOpen?.(); }} className="h-[1000px] w-full md:h-[720px]" />
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Calendar not loading?{" "}
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary underline">Open it in a new tab</a>
      </p>
    </div>
  );
}
