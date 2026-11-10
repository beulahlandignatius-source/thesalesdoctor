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
  const link = "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground";
  const active = { className: "!text-primary" };
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="font-display text-sm font-extrabold tracking-[0.2em] text-foreground">
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
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink-foreground/70 md:flex-row md:justify-between">
        <p>© 2026 The Sales Clinic · Dr. Dan Odotukpono, The Sales Doctor</p>
        <p>Results shown are past outcomes, not guarantees.</p>
      </div>
    </footer>
  );
}

const btn = {
  base: "inline-flex items-center justify-center gap-2 rounded-md font-display font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60",
  primary: "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_10px_30px_-12px_var(--color-primary)]",
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
