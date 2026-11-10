import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme";
import logo from "@/assets/logo-transparent.png";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/book", label: "Sessions", exact: false },
  { to: "/xray", label: "Client X-Ray", exact: false },
  { to: "/mentorship", label: "Mentorship", exact: true },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", esc); return () => window.removeEventListener("keydown", esc);
  }, [open]);
  return (
    <header className={cn("site-header sticky z-40 mx-3 mb-6 mt-3 md:mx-auto md:max-w-6xl", scrolled && "is-scrolled", open && "is-open")}>
      <div className="site-header-bar mx-auto flex items-center justify-between gap-3 px-3 sm:px-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-[13px] font-black tracking-[0.18em] text-foreground">
          <span className="nav-logo"><img src={logo} alt="The Sales Doctor" className="h-8 w-12 shrink-0 object-contain" /></span>
          <span className="leading-none">THE SALES <span className="text-primary">CLINIC</span></span>
        </Link>
        <nav className="nav-track hidden items-center md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} activeProps={{ className: "is-active" }} className="nav-link">{n.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CtaLink to="/book" size="sm" className="nav-cta hidden sm:inline-flex">BOOK A CONSULTATION</CtaLink>
          <button type="button" className="nav-burger md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <nav className={cn("nav-sheet md:hidden", open && "is-open")} aria-label="Mobile" inert={!open}>
        {NAV.map((n, i) => (
          <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.exact }} activeProps={{ className: "is-active" }}
            className="nav-sheet-link" style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}>
            <span className="nav-sheet-num">0{i + 1}</span>{n.label}<span className="nav-sheet-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
        <Link to="/book" onClick={() => setOpen(false)} className={btnClass("primary", "md", "mt-4 w-full")}>BOOK A CONSULTATION</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-5 pt-14">
        <img src={logo} alt="The Sales Doctor" className="mb-8 h-20 w-36 object-contain" />
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
          <p>Every business is unique. Results shown are real past client outcomes, and yours begin with your first session.</p>
        </div>
      </div>
    </footer>
  );
}

const btn = {
  base: "btn-sweep inline-flex min-h-12 items-center justify-center gap-2 rounded-full font-display active:scale-[0.98] font-bold tracking-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60 whitespace-normal text-center",
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
