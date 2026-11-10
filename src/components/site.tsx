import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/book", label: "Sessions", exact: false },
  { to: "/services", label: "Services", exact: true },
  { to: "/xray", label: "Client X-Ray", exact: false },
  { to: "/mentorship", label: "Mentorship", exact: true },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuToggle.current?.focus(); }
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const link = "ulink mx-2.5 py-3 text-sm font-medium text-muted-foreground transition hover:text-foreground";
  const active = { className: "!text-primary" };
  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-6 md:px-10">
        <Link to="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-1.5 font-display text-sm font-extrabold text-foreground">
          <span className="mr-1 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          THE SALES <span className="text-primary">CLINIC</span>
        </Link>
        <nav className="hidden items-center lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} activeProps={active} className={link}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink to="/book" size="sm" className="hidden sm:inline-flex">BOOK A CONSULTATION</CtaLink>
          <Button ref={menuToggle} variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mobile-navigation border-t border-border bg-background px-6 pb-6 pt-2 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.exact }} activeProps={active}
              className="block border-b border-border/60 py-3.5 font-display text-lg font-semibold text-foreground">{n.label}</Link>
          ))}
          <Link to="/book" onClick={() => setOpen(false)} className={btnClass("primary", "md", "mt-5 w-full")}>BOOK A CONSULTATION</Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-14 md:px-10">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink-foreground/15 pb-8 text-sm font-medium">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="ulink text-ink-foreground/70 hover:text-ink-foreground">{n.label}</Link>
          ))}
          <Link to="/book" className="ulink text-primary">Book a consultation →</Link>
        </nav>
        <p aria-hidden="true" className="select-none py-10 font-display text-4xl font-bold uppercase leading-none sm:text-6xl md:text-8xl lg:text-9xl">
          The Sales <span className="text-primary">Clinic</span>
        </p>
        <div className="flex flex-col gap-2 border-t border-ink-foreground/15 py-6 text-sm text-ink-foreground/60 md:flex-row md:justify-between">
          <p>© 2026 The Sales Clinic · Dr. Dan Odotukpono, The Sales Doctor</p>
          <p>Results shown are past outcomes, not guarantees.</p>
        </div>
      </div>
    </footer>
  );
}

const btn = {
   base: "clinic-button inline-flex items-center justify-center gap-2 rounded-md text-center font-sans font-semibold active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
  primary: "bg-primary text-primary-foreground",
  dark: "bg-ink text-ink-foreground hover:bg-ink/85",
   outline: "border border-current text-foreground hover:bg-foreground hover:text-background",
  light: "bg-ink-foreground text-ink hover:bg-blush",
   sm: "min-h-11 px-4 py-2 text-[11px]",
   md: "min-h-13 px-6 py-4 text-xs",
};
type V = "primary" | "dark" | "outline" | "light";
export const btnClass = (v: V = "primary", s: "sm" | "md" = "md", c?: string) => cn(btn.base, btn[v], btn[s], c);

export function CtaLink({ to, children, variant = "primary", size = "md", className }: { to: "/book" | "/book/free" | "/book/clinic" | "/mentorship" | "/" | "/xray" | "/audit"; children: ReactNode; variant?: V; size?: "sm" | "md"; className?: string }) {
  return <Button asChild variant="ghost" className={btnClass(variant, size, className)}><Link to={to}>{children}</Link></Button>;
}

export function ExtLink({ href, children, variant = "primary", className, onClick }: { href: string; children: ReactNode; variant?: V; className?: string; onClick?: () => void }) {
  return <Button asChild variant="ghost" className={btnClass(variant, "md", className)}><a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer">{children}</a></Button>;
}
