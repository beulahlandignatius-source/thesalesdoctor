/** Applies admin text/photo replacements to the rendered page by matching the original wording or image address. */
export type OverrideRow = { kind: string; original: string; replacement: string };
export type Maps = { text: Map<string, string>; image: Map<string, string> };

export const norm = (s: string) => s.replace(/\s+/g, " ").trim();
export const REMOVED_IMAGE = "__removed_image__";

export function buildMaps(rows: OverrideRow[], imageUrl: (path: string) => string | undefined): Maps {
  const text = new Map<string, string>(); const image = new Map<string, string>();
  for (const r of rows) {
    if (r.kind === "text") text.set(norm(r.original), r.replacement);
    else { const u = r.replacement === REMOVED_IMAGE ? REMOVED_IMAGE : imageUrl(r.replacement); if (u) image.set(r.original, u); }
  }
  return { text, image };
}

/** Replacement for one text value, keeping its surrounding spaces; null when nothing applies. */
export function replaceText(value: string, map: Map<string, string>): string | null {
  const key = norm(value);
  if (!key) return null;
  const next = map.get(key);
  if (next === undefined || next === key) return null;
  const lead = value.match(/^\s*/)?.[0] ?? ""; const trail = value.match(/\s*$/)?.[0] ?? "";
  return lead + next + trail;
}

export const originalText = new WeakMap<Node, string>();

export function applyAll(root: HTMLElement, maps: Maps) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest("script,style,[data-no-edit]") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const next = replaceText(n.nodeValue ?? "", maps.text);
    if (next !== null) { originalText.set(n, norm(n.nodeValue ?? "")); n.nodeValue = next; }
  }
  root.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
    if (img.closest("[data-no-edit]")) return;
    const orig = img.dataset["origSrc"] ?? img.getAttribute("src") ?? "";
    const next = maps.image.get(orig);
    if (next === REMOVED_IMAGE) { img.dataset["origSrc"] = orig; img.hidden = true; return; }
    if (next && img.getAttribute("src") !== next) { img.dataset["origSrc"] = orig; img.removeAttribute("srcset"); img.setAttribute("src", next); }
  });
}
