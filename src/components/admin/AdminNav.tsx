import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, ScanLine, Inbox, ExternalLink, LogOut, Menu, KeyRound, Star, Receipt, PenLine, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const items = [
  { to: "/admin", label: "Overview", short: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/enquiries", label: "Sales Clinic", short: "Clinic", icon: Inbox, exact: false },
  { to: "/admin/xray", label: "Client X-Ray", short: "X-Ray", icon: ScanLine, exact: false },
  { to: "/admin/reviews", label: "Reviews", short: "Reviews", icon: Star, exact: false },
  { to: "/admin/payments", label: "Payments", short: "Payments", icon: Receipt, exact: false },
  { to: "/admin/content", label: "Content", short: "Content", icon: PenLine, exact: false },
] as const;

export function AdminNav({ onSignOut, email }: { onSignOut: () => void; email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = useLocation({ select: (location) => location.pathname });
  const current = items.find((i) => i.exact ? pathname === i.to || pathname === `${i.to}/` : pathname.startsWith(i.to));
  const secondaryActive = items.slice(3).some((i) => pathname.startsWith(i.to)) || pathname === "/admin/password";
  const linkCls = "admin-nav-link";
  const active = { className: "admin-nav-active" };
  const logout = () => { setOpen(false); onSignOut(); };
  return (
    <>
      <aside className="admin-sidebar hidden lg:flex">
        <Link to="/admin" className="px-3 font-display text-lg font-extrabold">THE SALES <span className="text-primary">CLINIC</span></Link>
        <p className="mb-8 mt-2 px-3 text-xs text-muted-foreground">Admin workspace</p>
        <nav aria-label="Admin sidebar" className="space-y-1">{items.map((i) => <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={active} className={linkCls}><i.icon className="h-5 w-5 shrink-0" />{i.label}</Link>)}</nav>
        <div className="mt-auto space-y-1 border-t border-border pt-4">
          <ThemeToggle />
          <Link to="/" className={linkCls}><ExternalLink className="h-4 w-4" />View site</Link>
          <Link to="/admin/password" className={linkCls}><KeyRound className="h-4 w-4" />Password</Link>
          <Button variant="ghost" onClick={logout} className={linkCls + " w-full justify-start"}><LogOut />Log out</Button>
          <p className="break-all px-3 pt-3 text-xs text-muted-foreground">{email}</p>
        </div>
      </aside>
      <header className="admin-topbar sticky top-0 z-40 border-b border-border bg-background lg:hidden">
        <div className="admin-mobile-heading grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5">
          <Link to="/admin" className="min-w-0 font-display text-sm font-extrabold">SALES <span className="text-primary">ADMIN</span><span className="mt-0.5 block truncate font-sans text-xs font-normal text-muted-foreground">{current?.label ?? (pathname === "/admin/password" ? "Account" : "X-Ray details")}</span></Link>
          <div className="flex shrink-0 items-center gap-1"><ThemeToggle /><Button variant="ghost" size="icon" aria-label="Open admin menu" aria-haspopup="dialog" onClick={() => setOpen(true)}><Menu /></Button></div>
        </div>
      </header>
      <nav aria-label="Admin sections" className="admin-bottom-nav lg:hidden">
        {items.slice(0, 3).map((i) => <Link key={i.to} to={i.to} activeOptions={{ exact: i.exact }} activeProps={active} className="admin-bottom-tab"><i.icon aria-hidden="true" className="h-5 w-5 shrink-0" /><span>{i.short}</span></Link>)}
        <Button variant="ghost" className={`admin-bottom-tab ${secondaryActive ? "admin-nav-active" : ""}`} aria-label="More admin sections" aria-haspopup="dialog" onClick={() => setOpen(true)}><MoreHorizontal aria-hidden="true" /><span>More</span></Button>
      </nav>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="admin-menu-dialog gap-3 rounded-xl">
          <DialogTitle className="pr-10 font-display">Admin workspace</DialogTitle>
          <DialogDescription className="break-all text-xs">{email}</DialogDescription>
          <nav aria-label="All admin sections" className="grid grid-cols-2 gap-2">{items.map((i) => <Link key={i.to} to={i.to} onClick={() => setOpen(false)} activeOptions={{ exact: i.exact }} activeProps={active} className="admin-menu-link"><i.icon className="h-5 w-5 shrink-0" /><span className="min-w-0">{i.label}</span></Link>)}</nav>
          <div className="grid gap-1 border-t border-border pt-2">
            <Link to="/" onClick={() => setOpen(false)} className={linkCls}><ExternalLink className="h-4 w-4" />View site<ArrowUpRight className="ml-auto h-4 w-4" /></Link>
            <Link to="/admin/password" onClick={() => setOpen(false)} className={linkCls}><KeyRound className="h-4 w-4" />Change password</Link>
            <Button variant="ghost" onClick={logout} className={linkCls + " justify-start"}><LogOut />Log out</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
