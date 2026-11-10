import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, ScanLine, Inbox, ExternalLink, LogOut, Menu, X } from "lucide-react";

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Sales Clinic", icon: Inbox, exact: false },
  { to: "/admin/xray", label: "Client X-Ray", icon: ScanLine, exact: false },
] as const;

export function AdminNav({ onSignOut, email }: { onSignOut: () => void; email: string }) {
  const [open, setOpen] = useState(false);
  const linkCls = "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground";
  const active = { className: "bg-blush !text-primary" };
  return (
    <header className="sticky top-0 z-40 xray-bar border-b border-border bg-card/80 backdrop-blur-xl">
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
          <button onClick={onSignOut} className={linkCls}><LogOut className="h-4 w-4" /> Log out</button>
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-md md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {/* One UI-style bottom tab bar on phones */}
      <nav aria-label="Admin sections" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-3 gap-1 rounded-[1.75rem] border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur-xl md:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        {items.map((i) => (
          <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={{ className: "bg-blush !text-primary" }}
            className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[1.4rem] text-[11px] font-semibold text-muted-foreground transition active:scale-95">
            <i.icon className="h-5 w-5" /> {i.label}
          </Link>
        ))}
      </nav>
      {open && (
        <nav className="mx-3 mb-3 rounded-3xl border border-border bg-card px-2 pb-3 pt-2 shadow-lg md:hidden" aria-label="Admin mobile">
          <Link to="/" onClick={() => setOpen(false)} className={linkCls}><ExternalLink className="h-4 w-4" /> View site</Link>
          <button onClick={onSignOut} className={linkCls + " w-full"}><LogOut className="h-4 w-4" /> Log out</button>
          <p className="px-3 pt-2 text-xs text-muted-foreground">{email}</p>
        </nav>
      )}
    </header>
  );
}
