import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PenLine, Trash2, Plus, ExternalLink, Image as ImageIcon } from "lucide-react";
import { backend as supabase } from "@/lib/backend/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Site content | Admin, The Sales Clinic" }, { name: "robots", content: "noindex" }] }),
  component: ContentAdmin,
});

type Row = { id: string; kind: string; original: string; replacement: string; updated_at: string };

function ContentAdmin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [orig, setOrig] = useState(""); const [repl, setRepl] = useState(""); const [msg, setMsg] = useState("");
  const load = async () => { const { data } = await supabase.from("site_overrides").select("*").order("updated_at", { ascending: false }); setRows((data ?? []) as Row[]); };
  useEffect(() => { void load(); }, []);

  const save = async (original: string, replacement: string) => {
    const { error } = await supabase.from("site_overrides").upsert({ kind: "text", original: original.replace(/\s+/g, " ").trim(), replacement: replacement.replace(/\s+/g, " ").trim(), updated_at: new Date().toISOString() }, { onConflict: "kind,original" });
    setMsg(error ? "Couldn't save. Please try again." : "Saved. Visitors see it on their next visit."); await load();
  };
  const remove = async (id: string) => { await supabase.from("site_overrides").delete().eq("id", id); await load(); };

  return <div className="space-y-8">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="eyebrow">Site content</p><h1 className="mt-2 font-display text-3xl font-black md:text-4xl">Edit your website</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">Open any page while signed in and tap <b>Edit this page</b> at the bottom. Tap any heading, paragraph, button or photo to change it.</p></div>
      <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"><ExternalLink className="h-4 w-4" /> Open the site to edit</Link>
    </header>

    <section className="dashboard-card rounded-3xl border border-border bg-card p-5">
      <h2 className="font-display text-lg font-bold">Change wording by hand</h2>
      <p className="mt-1 text-sm text-muted-foreground">Useful for wording that's hard to tap, like the browser tab title or text inside pop-ups. Paste the exact current wording, then the new wording.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <textarea value={orig} onChange={(e) => setOrig(e.target.value)} placeholder="Current wording" rows={3} className="rounded-2xl border border-border bg-background p-3 text-sm" />
        <textarea value={repl} onChange={(e) => setRepl(e.target.value)} placeholder="New wording" rows={3} className="rounded-2xl border border-border bg-background p-3 text-sm" />
      </div>
      <Button variant="premium" className="mt-3 gap-2" disabled={!orig.trim() || !repl.trim()} onClick={async () => { await save(orig, repl); setOrig(""); setRepl(""); }}><Plus className="h-4 w-4" /> Save change</Button>
      {msg && <p role="status" className="mt-2 text-sm text-muted-foreground">{msg}</p>}
    </section>

    <section>
      <h2 className="font-display text-lg font-bold">Your changes {rows && <span className="text-muted-foreground">({rows.length})</span>}</h2>
      {rows === null ? <p className="mt-4 text-muted-foreground">Loading…</p> : rows.length === 0 ?
        <div className="mt-4 rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground"><PenLine className="mx-auto h-6 w-6 text-primary" /><p className="mt-2">No changes yet. Everything shows the original wording and photos.</p></div> :
        <ul className="mt-4 space-y-3">{rows.map((r) => <EditRow key={r.id} row={r} onSave={save} onRemove={remove} />)}</ul>}
    </section>
  </div>;
}

function EditRow({ row, onSave, onRemove }: { row: Row; onSave: (o: string, r: string) => Promise<void>; onRemove: (id: string) => Promise<void> }) {
  const [v, setV] = useState(row.replacement);
  return <li className="rounded-3xl border border-border bg-card p-4">
    <div className="flex items-start justify-between gap-3">
      <p className="text-xs text-muted-foreground">{row.kind === "image" ? <span className="inline-flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Photo swapped</span> : <>Was: {row.original}</>}</p>
      <button type="button" aria-label="Undo this change" onClick={() => onRemove(row.id)} className="shrink-0 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
    </div>
    {row.kind === "text" && <div className="mt-2 flex flex-col gap-2 sm:flex-row"><textarea value={v} onChange={(e) => setV(e.target.value)} rows={2} className="min-w-0 flex-1 rounded-2xl border border-border bg-background p-3 text-sm" />
      <Button variant="outline" disabled={v === row.replacement || !v.trim()} onClick={() => onSave(row.original, v)}>Update</Button></div>}
  </li>;
}
