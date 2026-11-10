import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Inbox, Receipt, Star, ArrowLeft, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { searchAdminRecords } from "@/lib/admin-search.functions";
import type { AdminSearchResult } from "@/lib/admin-search";

const groups = [
  { type: "enquiry", label: "Enquiries", icon: Inbox },
  { type: "payment", label: "Confirmed payments", icon: Receipt },
  { type: "screenshot", label: "Payment screenshots", icon: Receipt },
  { type: "review", label: "Reviews", icon: Star },
] as const;

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState<AdminSearchResult | null>(null);
  const load = useServerFn(searchAdminRecords);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);
  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["admin-global-search", debounced],
    queryFn: () => load({ data: { query: debounced } }),
    enabled: open && debounced.length >= 2,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });
  const changeOpen = (value: boolean) => { setOpen(value); if (!value) { setQuery(""); setDebounced(""); setSelected(null); } };
  const pending = isFetching || query.trim() !== debounced;
  return <>
    <Button variant="outline" className="hidden w-full justify-start gap-2 lg:flex" onClick={() => changeOpen(true)} aria-label="Search admin records"><Search className="h-4 w-4" />Search records</Button>
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => changeOpen(true)} aria-label="Search admin records"><Search /></Button>
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-xl gap-4 rounded-lg p-4 sm:p-6">
        <DialogTitle className="pr-8 font-display">{selected ? "Confirmed payment" : "Search admin records"}</DialogTitle>
        <DialogDescription>{selected ? "Payment received through Stripe or Flutterwave." : "Enquiries, payments and client reviews"}</DialogDescription>
        {selected?.details ? <div className="min-w-0 space-y-4">
          <Button variant="ghost" onClick={() => setSelected(null)}><ArrowLeft />Back to results</Button>
          <dl className="grid gap-4 text-sm">
            <div><dt className="text-muted-foreground">Amount</dt><dd className="text-xl font-bold">{selected.details.currency} {(selected.details.amount / 100).toFixed(2)}</dd></div>
            <div><dt className="text-muted-foreground">Provider</dt><dd className="capitalize">{selected.details.provider}</dd></div>
            <div><dt className="text-muted-foreground">Payment reference</dt><dd className="break-all">{selected.details.reference}</dd></div>
            <div><dt className="text-muted-foreground">Paid on</dt><dd>{new Date(selected.date).toLocaleString()}</dd></div>
            <div><dt className="text-muted-foreground">Status</dt><dd className="text-primary">Provider-confirmed</dd></div>
          </dl>
        </div> : <>
          <div className="relative"><Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search all admin records" placeholder="Name, email, reference or review text" maxLength={120} value={query} onChange={(e) => setQuery(e.target.value)} className="min-h-11 pl-9" /></div>
          <div className="max-h-[55dvh] min-h-24 overflow-y-auto overscroll-contain" aria-live="polite" aria-busy={pending}>
            {query.trim().length < 2 ? <p className="py-6 text-center text-sm text-muted-foreground">Enter at least two characters.</p>
              : pending ? <p role="status" className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />Searching…</p>
              : isError ? <div role="alert" className="py-4 text-sm"><p>Couldn’t search records.</p><Button variant="outline" className="mt-3" onClick={() => refetch()}>Try again</Button></div>
              : !data?.length ? <p className="py-6 text-center text-sm text-muted-foreground">No matching records.</p>
              : groups.map((group) => {
                const results = data.filter((r) => r.type === group.type);
                if (!results.length) return null;
                return <section key={group.type} className="mb-4"><h2 className="flex items-center gap-2 border-b border-border pb-2 text-xs font-semibold text-muted-foreground"><group.icon className="h-4 w-4" />{group.label}<span className="ml-auto">{results.length === 10 ? "10+" : results.length}</span></h2>
                  {results.map((r) => {
                    const content = <><span className="flex flex-wrap items-center justify-between gap-1"><span className="font-semibold">{r.title}</span><span className="text-xs capitalize text-primary">{r.status}</span></span><span className="mt-1 block break-words text-xs text-muted-foreground">{r.subtitle}</span><span className="mt-1 block text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</span></>;
                    const cls = "block w-full min-w-0 rounded-md px-2 py-3 text-left text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";
                    return r.type === "payment" ? <Button key={r.id} variant="ghost" className={`${cls} h-auto whitespace-normal`} onClick={() => setSelected(r)}>{content}</Button>
                      : <Link key={r.id} to={r.type === "enquiry" ? "/admin/enquiries" : r.type === "review" ? "/admin/reviews" : "/admin/payments"} search={{ record: r.id }} className={cls} onClick={() => changeOpen(false)}>{content}</Link>;
                  })}
                </section>;
              })}
          </div>
        </>}
      </DialogContent>
    </Dialog>
  </>;
}