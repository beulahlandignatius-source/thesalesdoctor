import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { Pencil, X, ImageUp, Check, RotateCcw } from "lucide-react";
import { backend as supabase } from "@/lib/backend/client";
import { applyAll, buildMaps, norm, originalText, type Maps, type OverrideRow } from "@/lib/site-content/engine";
import { getSiteOverrides } from "@/lib/site-content/overrides.functions";
import { canShowPageEditor } from "@/lib/site-content/editor-scope";

const PAGES = [["/", "Home"], ["/services", "Services"], ["/about", "About"], ["/book", "Sessions"], ["/book/free", "Free review"], ["/book/clinic", "Private Clinic"], ["/mentorship", "Mentorship"], ["/xray", "Client X-Ray"], ["/reviews", "Reviews gallery"]] as const;

type Target = { kind: "text"; original: string; current: string } | { kind: "image"; original: string; current: string };

/** Loads saved edits for every visitor and lets signed-in admins click any wording or photo to change it. */
export function SiteEditor() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const maps = useRef<Maps>({ text: new Map(), image: new Map() });
  const [isAdmin, setIsAdmin] = useState(false);
  const [embeddedEditor, setEmbeddedEditor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [target, setTarget] = useState<Target | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const apply = useCallback(() => applyAll(document.body, maps.current), []);
  useEffect(() => {
    try { setEmbeddedEditor(window.parent !== window && window.parent.location.origin === window.location.origin && /^\/admin\/content\/?$/.test(window.parent.location.pathname)); }
    catch { setEmbeddedEditor(false); }
  }, []);
  const allowed = canShowPageEditor(isAdmin, embeddedEditor, "/admin/content");

  const load = useCallback(async () => {
    const { rows: raw, urls: signed } = await getSiteOverrides();
    const rows = raw as OverrideRow[];
    const urls = new Map<string, string>(Object.entries(signed));
    maps.current = buildMaps(rows, (p) => urls.get(p));
    apply();
  }, [apply]);

  useEffect(() => {
    void load();
    let raf = 0;
    const obs = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(apply); });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [load, apply]);

  useEffect(() => { const id = requestAnimationFrame(apply); return () => cancelAnimationFrame(id); }, [path, apply]);

  useEffect(() => {
    const check = async () => {
      const { data: s } = await supabase.auth.getSession();
      const uid = s.session?.user.id;
      if (!uid) return setIsAdmin(false);
      const { data } = await supabase.from("admin_users").select("user_id").eq("user_id", uid).maybeSingle();
      setIsAdmin(!!data);
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((e) => { if (e === "SIGNED_IN" || e === "SIGNED_OUT") void check(); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("site-editing", editing && allowed);
    if (!editing || !allowed) return;
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest("[data-no-edit]")) return;
      e.preventDefault(); e.stopPropagation();
      const img = el.closest("img");
      if (img) { const orig = img.dataset["origSrc"] ?? img.getAttribute("src") ?? ""; setErr(""); setTarget({ kind: "image", original: orig, current: img.currentSrc }); return; }
      const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
      let node: Node | null = range?.startContainer ?? null;
      if (!node || node.nodeType !== Node.TEXT_NODE || !norm(node.nodeValue ?? "")) {
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); node = null;
        for (let n = w.nextNode(); n; n = w.nextNode()) if (norm(n.nodeValue ?? "")) { node = n; break; }
      }
      if (!node) return;
      const current = norm(node.nodeValue ?? "");
      setErr(""); setDraft(current); setTarget({ kind: "text", original: originalText.get(node) ?? current, current });
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); document.body.classList.remove("site-editing"); };
  }, [editing, allowed]);

  if (path.startsWith("/admin") || !allowed) return null;

  const saveText = async () => {
    if (!target) return; setBusy(true); setErr("");
    const value = norm(draft);
    const res = !value || value === target.original
      ? await supabase.from("site_overrides").delete().eq("kind", "text").eq("original", target.original)
      : await supabase.from("site_overrides").upsert({ kind: "text", original: target.original, replacement: value, updated_at: new Date().toISOString() }, { onConflict: "kind,original" });
    setBusy(false);
    if (res.error) return setErr("Couldn't save. Please try again.");
    if (!value || value === target.original) return window.location.reload();
    setTarget(null); await load();
  };

  const saveImage = async (file: File | undefined) => {
    if (!file || !target) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) return setErr("Use a JPG, PNG or WebP photo up to 5MB.");
    setBusy(true); setErr("");
    const p = `${crypto.randomUUID()}.${file.type.split("/")[1]}`;
    const up = await supabase.storage.from("site-media").upload(p, file, { contentType: file.type });
    const res = up.error ? up : await supabase.from("site_overrides").upsert({ kind: "image", original: target.original, replacement: p, updated_at: new Date().toISOString() }, { onConflict: "kind,original" });
    setBusy(false);
    if (res.error) return setErr("Couldn't upload. Please try again.");
    setTarget(null); await load();
  };

  const resetImage = async () => {
    if (!target) return; setBusy(true);
    await supabase.from("site_overrides").delete().eq("kind", "image").eq("original", target.original);
    window.location.reload();
  };

  return <div data-no-edit>
    <div className="site-editor-bar">
      {editing ? <>
        <span className="site-editor-live" aria-hidden="true" /><span className="hidden text-sm font-semibold sm:inline">Editing: tap any wording or photo</span>
        <select aria-label="Go to page" value={PAGES.some(([p]) => p === path) ? path : ""} onChange={(e) => e.target.value && navigate({ to: e.target.value })} className="site-editor-select">
          <option value="">Go to page…</option>
          {PAGES.map(([p, l]) => <option key={p} value={p}>{l}</option>)}
        </select>
        <button type="button" onClick={() => setEditing(false)} className="site-editor-btn"><Check className="h-4 w-4" /> Done</button>
      </> : <button type="button" onClick={() => setEditing(true)} className="site-editor-btn"><Pencil className="h-4 w-4" /> Edit this page</button>}
    </div>
    {target && <div className="site-editor-overlay" role="dialog" aria-modal="true" aria-label={target.kind === "text" ? "Edit wording" : "Change photo"}>
      <div className="site-editor-card">
        <div className="flex items-center justify-between"><h2 className="font-display text-lg font-bold">{target.kind === "text" ? "Edit wording" : "Change photo"}</h2><button type="button" aria-label="Close" onClick={() => setTarget(null)} className="rounded-full p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
        {target.kind === "text" ? <>
          {target.original !== target.current && <p className="mt-2 text-xs text-muted-foreground">Original: {target.original}</p>}
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={5} className="mt-3 w-full rounded-2xl border border-border bg-background p-3 text-sm" autoFocus />
          <p className="mt-2 text-xs text-muted-foreground">This changes the same wording everywhere it appears. Clear it to go back to the original.</p>
          <div className="mt-4 flex justify-end gap-2"><button type="button" className="site-editor-btn site-editor-ghost" onClick={() => setTarget(null)}>Cancel</button><button type="button" disabled={busy} className="site-editor-btn" onClick={saveText}>{busy ? "Saving…" : "Save"}</button></div>
        </> : <>
          <img src={target.current} alt="" className="mt-3 max-h-48 w-full rounded-2xl object-contain bg-muted" />
          <label className="site-editor-btn mt-4 w-full cursor-pointer justify-center"><ImageUp className="h-4 w-4" /> {busy ? "Uploading…" : "Upload new photo"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => saveImage(e.target.files?.[0])} /></label>
          <button type="button" onClick={resetImage} className="site-editor-btn site-editor-ghost mt-2 w-full justify-center"><RotateCcw className="h-4 w-4" /> Use original photo</button>
        </>}
        {err && <p role="alert" className="mt-3 text-sm text-destructive">{err}</p>}
      </div>
    </div>}
  </div>;
}
