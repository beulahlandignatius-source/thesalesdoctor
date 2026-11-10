import { Link, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X, House, CalendarCheck, ScanLine, GraduationCap, HeartPulse, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle, useThemeState } from "@/components/theme";
import logo from "@/assets/logo-transparent.png";

const NAV = [
  { to: "/", label: "Home", exact: true },
  { to: "/book", label: "Sessions", exact: false },
  { to: "/xray", label: "Client X-Ray", exact: false },
  { to: "/mentorship", label: "Mentorship", exact: true },
] as const;
const NAV_ICON = { "/": House, "/book": CalendarCheck, "/xray": ScanLine, "/mentorship": GraduationCap } as const;

/** Live clock for the drawer header; renders only after mount so it never mismatches. */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => { setNow(new Date()); const id = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(id); }, []);
  return now;
}

/** Side drawer laid out like a patient chart: vitals header, page tiles, quick settings and a booking card. */
function ClinicDrawer({ onClose }: { onClose: () => void }) {
  const now = useNow();
  const { dark, toggle } = useThemeState();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string, exact: boolean) => (exact ? path === to : path.startsWith(to));
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="clinic-drawer-overlay" />
      <Dialog.Content id="mobile-menu" className="clinic-drawer">
        <Dialog.Title className="sr-only">Site menu</Dialog.Title>
        <Dialog.Description className="sr-only">Pages, display settings and booking.</Dialog.Description>
        <div className="clinic-drawer-head">
          <div>
            <p className="clinic-drawer-tag"><span className="clinic-drawer-live" aria-hidden="true" /> The Sales Clinic</p>
            <p className="mt-3 font-display text-4xl font-extrabold leading-none tabular-nums" suppressHydrationWarning>{now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "\u00a0"}</p>
            <p className="mt-1.5 text-xs font-medium opacity-70" suppressHydrationWarning>{now ? now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" }) : "\u00a0"}</p>
          </div>
          <Dialog.Close className="clinic-drawer-close" aria-label="Close menu"><X className="h-5 w-5" /></Dialog.Close>
          <svg viewBox="0 0 300 40" className="clinic-drawer-ecg" aria-hidden="true" preserveAspectRatio="none"><path d="M0 26 H70 L80 26 L88 8 L96 36 L104 18 L112 26 H180 L190 26 L198 4 L206 38 L214 20 L222 26 H300" /></svg>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 pt-5">
          <p className="clinic-drawer-label">Pages</p>
          <nav aria-label="Mobile" className="mt-2.5 grid grid-cols-2 gap-2.5">
            {NAV.map((n, i) => {
              const Icon = NAV_ICON[n.to]; const active = isActive(n.to, n.exact);
              return (
                <Link key={n.to} to={n.to} onClick={onClose} aria-current={active ? "page" : undefined} style={{ animationDelay: `${80 + i * 45}ms` }} className={cn("clinic-tile", active && "is-active")}>
                  <span className="flex items-start justify-between"><span className="clinic-tile-icon"><Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" /></span><span className="clinic-tile-num">0{i + 1}</span></span>
                  <span className="flex items-end justify-between gap-2"><span className="text-[0.95rem] font-semibold">{n.label}</span>{active && <span className="text-[0.65rem] font-bold uppercase tracking-wider opacity-80">Here</span>}</span>
                </Link>
              );
            })}
          </nav>
          <p className="clinic-drawer-label mt-6">Quick settings</p>
          <button type="button" onClick={toggle} aria-pressed={dark} style={{ animationDelay: "300ms" }} className={cn("clinic-tile mt-2.5 w-full !min-h-0 !flex-row items-center", dark && "is-active")}>
            <span className="clinic-tile-icon">{dark ? <Moon className="h-[1.1rem] w-[1.1rem]" /> : <Sun className="h-[1.1rem] w-[1.1rem]" />}</span>
            <span className="ml-3 text-left"><span className="block text-[0.95rem] font-semibold">Dark mode</span><span className="block text-xs opacity-70">{dark ? "On" : "Off"}</span></span>
            <span className={cn("clinic-switch ml-auto", dark && "is-on")} aria-hidden="true" />
          </button>
        </div>
        <div className="p-3">
          <div className="clinic-drawer-cta clinic-tile-anim" style={{ animationDelay: "360ms" }}>
            <HeartPulse className="h-6 w-6 text-primary" aria-hidden="true" />
            <p className="mt-3 font-display text-lg font-extrabold leading-snug">Start free, or go deep. Either way, you leave knowing what to do next.</p>
            <Link to="/book" onClick={onClose} className={btnClass("primary", "md", "mt-4 w-full")}>BOOK A CONSULTATION →</Link>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => { setScrolled(window.scrollY > 24); const h = document.documentElement.scrollHeight - window.innerHeight; setProgress(h > 0 ? Math.min(1, window.scrollY / h) : 0); };
    on(); window.addEventListener("scroll", on, { passive: true }); window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const current = NAV.find((n) => (n.exact ? path === n.to : path.startsWith(n.to)));
  return (
    <header className={cn("site-header sticky z-40 mx-3 mb-6 mt-3 md:mx-auto md:max-w-6xl", scrolled && "is-scrolled")}>
      <div className="site-header-bar relative mx-auto flex items-center justify-between gap-3 px-3 sm:px-4">
        <span className="nav-progress" aria-hidden="true" style={{ transform: `scaleX(${progress})` }} />
        <Link to="/" className="flex items-center gap-2.5 font-display text-[13px] font-black tracking-[0.18em] text-foreground">
          <span className="nav-logo"><img src={logo} alt="The Sales Doctor" className="h-8 w-12 shrink-0 object-contain" /></span>
          <span className="leading-none">THE SALES <span className="text-primary">CLINIC</span>{current && <span className="nav-here md:hidden"><span className="nav-here-dot" aria-hidden="true" />{current.label}</span>}</span>
        </Link>
        <nav className="nav-track hidden items-center md:flex" aria-label="Main">
          {NAV.map((n) => {
            const Icon = NAV_ICON[n.to];
            return <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} activeProps={{ className: "is-active" }} className="nav-link"><Icon className="nav-link-icon h-3.5 w-3.5" aria-hidden="true" />{n.label}</Link>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex"><ThemeToggle /></span>
          <CtaLink to="/book" size="sm" className="nav-cta hidden sm:inline-flex">BOOK A CONSULTATION</CtaLink>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="nav-burger md:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></Dialog.Trigger>
            <ClinicDrawer onClose={() => setOpen(false)} />
          </Dialog.Root>
        </div>
      </div>
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
