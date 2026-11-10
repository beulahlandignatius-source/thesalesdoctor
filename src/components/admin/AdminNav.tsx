import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, ScanLine, Inbox, ExternalLink, LogOut, Menu, X, KeyRound, Star, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Sales Clinic", icon: Inbox, exact: false },
  { to: "/admin/xray", label: "Client X-Ray", icon: ScanLine, exact: false },
  { to: "/admin/reviews", label: "Reviews", icon: Star, exact: false },
  { to: "/admin/payments", label: "Payments", icon: Receipt, exact: false },
] as const;

export function AdminNav({ onSignOut, email }: { onSignOut: () => void; email: string }) {
  const [open, setOpen] = useState(false);
  const linkCls = "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground";
  const active = { className: "bg-blush !text-primary" };
  return (
    <>
      <aside className="admin-sidebar hidden lg:flex">
        <Link to="/admin" className="px-3 font-display text-lg font-extrabold">THE SALES <span className="text-primary">CLINIC</span></Link>
        <p className="mb-10 mt-2 px-3 text-xs text-muted-foreground">Admin workspace</p>
        <nav aria-label="Admin sidebar" className="space-y-2">{items.map((i) => <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={active} className={linkCls + " !rounded-2xl !py-3"}><i.icon className="h-5 w-5" />{i.label}</Link>)}</nav>
        <div className="mt-auto space-y-2 border-t border-border pt-6">
          <ThemeToggle />
          <Link to="/" className={linkCls}><ExternalLink className="h-4 w-4" />View site</Link>
          <Link to="/admin/password" className={linkCls}><KeyRound className="h-4 w-4" />Password</Link>
          <Button variant="ghost" onClick={onSignOut} className={linkCls + " w-full !justify-start"}><LogOut />Log out</Button>
          <p className="break-all px-4 pt-4 text-xs text-muted-foreground">{email}</p>
        </div>
      </aside>
      {/* One UI-style bottom tab bar on phones */}
      <nav aria-label="Admin sections" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 gap-1 rounded-[1.75rem] border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-xl md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        {items.map((i) => (
          <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={{ className: "bg-blush !text-primary" }}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[1.4rem] text-[11px] font-semibold text-muted-foreground transition active:scale-95">
            <i.icon className="h-5 w-5" /> {i.label}
          </Link>
        ))}
      </nav>
    <header className="admin-topbar sticky top-3 z-40 xray-bar mx-3 mt-3 rounded-full border border-border bg-card/80 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <Link to="/admin" className="font-display text-sm font-extrabold tracking-[0.18em] text-foreground">
          SALES <span className="text-primary">ADMIN</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Admin">
          {items.map((i) => (
            <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={active} className={linkCls}>
              <i.icon className="h-4 w-4" /> {i.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={linkCls}><ExternalLink className="h-4 w-4" /> View site</Link>
          <Link to="/admin/password" className={linkCls}><KeyRound className="h-4 w-4" /> Password</Link>
          <Button variant="ghost" onClick={onSignOut} className={linkCls}><LogOut className="h-4 w-4" /> Log out</Button>
        </div>
        <div className="flex items-center gap-1"><ThemeToggle />
        <Button variant="outline" size="icon" className="rounded-full md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        </div>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-full mt-3 rounded-3xl border border-border bg-card px-2 pb-3 pt-2 shadow-lg md:hidden" aria-label="Admin mobile">
          <Link to="/" onClick={() => setOpen(false)} className={linkCls}><ExternalLink className="h-4 w-4" /> View site</Link>
          <Link to="/admin/password" onClick={() => setOpen(false)} className={linkCls}><KeyRound className="h-4 w-4" /> Change password</Link>
          <Button variant="ghost" onClick={onSignOut} className={linkCls + " w-full !justify-start"}><LogOut className="h-4 w-4" /> Log out</Button>
          <p className="px-3 pt-2 text-xs text-muted-foreground">{email}</p>
        </nav>
      )}
    </header>
    </>
  );
}
