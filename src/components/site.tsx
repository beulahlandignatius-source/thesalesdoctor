import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/book", label: "Sessions", exact: false },
  { to: "/xray", label: "Client X-Ray", exact: false },
  { to: "/mentorship", label: "Mentorship", exact: true },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const link = "ulink mx-3 py-2 font-display text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground";
  const active = { className: "!text-primary" };
  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link to="/" className="flex items-center gap-2 font-display text-sm font-black tracking-[0.2em] text-foreground">
          <span className="h-3 w-3 bg-primary" aria-hidden="true" />
          THE SALES <span className="text-primary">CLINIC</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} activeProps={active} className={link}>{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink to="/book" size="sm" className="hidden sm:inline-flex">BOOK A CONSULTATION</CtaLink>
          <button className="flex h-11 w-11 items-center justify-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 pb-5 pt-2 md:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.exact }} activeProps={active}
              className="block border-b border-border/60 py-3.5 font-display text-lg font-bold text-foreground">{n.label}</Link>
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
      <div className="mx-auto max-w-7xl px-5 pt-14">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink-foreground/15 pb-8 font-display text-sm font-bold uppercase tracking-[0.16em]">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="ulink text-ink-foreground/70 hover:text-ink-foreground">{n.label}</Link>
          ))}
          <Link to="/book" className="ulink text-primary">Book a consultation →</Link>
        </nav>
        <p aria-hidden="true" className="select-none pt-8 font-display font-black uppercase leading-[0.8] tracking-[-0.05em] text-[clamp(3.2rem,15vw,13rem)]">
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
  base: "btn-sweep inline-flex items-center justify-center gap-2 rounded-[2px] font-display active:scale-[0.98] font-extrabold tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
  primary: "bg-primary text-primary-foreground",
  dark: "bg-ink text-ink-foreground hover:bg-ink/85",
  outline: "border-2 border-foreground text-foreground hover:bg-foreground hover:text-background",
  light: "bg-ink-foreground text-ink hover:bg-blush",
  sm: "h-10 px-4 text-xs",
  md: "h-13 px-7 text-sm py-4",
};
type V = "primary" | "dark" | "outline" | "light";
export const btnClass = (v: V = "primary", s: "sm" | "md" = "md", c?: string) => cn(btn.base, btn[v], btn[s], c);

export function CtaLink({ to, children, variant = "primary", size = "md", className }: { to: "/book" | "/book/free" | "/book/clinic" | "/mentorship" | "/" | "/xray" | "/audit"; children: ReactNode; variant?: V; size?: "sm" | "md"; className?: string }) {
  return <Link to={to} className={btnClass(variant, size, className)}>{children}</Link>;
}

export function ExtLink({ href, children, variant = "primary", className, onClick }: { href: string; children: ReactNode; variant?: V; className?: string; onClick?: () => void }) {
  return <a href={href} onClick={onClick} target="_blank" rel="noopener noreferrer" className={btnClass(variant, "md", className)}>{children}</a>;
}
