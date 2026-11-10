import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="font-display text-sm font-extrabold tracking-[0.2em] text-foreground">
          THE SALES <span className="text-primary">CLINIC</span>
        </Link>
        <CtaLink to="/book" size="sm">BOOK A CONSULTATION</CtaLink>
      </div>
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

export function CtaLink({ to, children, variant = "primary", size = "md", className }: { to: "/book" | "/book/free" | "/book/clinic" | "/mentorship" | "/"; children: ReactNode; variant?: V; size?: "sm" | "md"; className?: string }) {
  return <Link to={to} className={btnClass(variant, size, className)}>{children}</Link>;
}

export function ExtLink({ href, children, variant = "primary", className }: { href: string; children: ReactNode; variant?: V; className?: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={btnClass(variant, "md", className)}>{children}</a>;
}
