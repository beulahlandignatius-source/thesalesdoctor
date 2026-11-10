import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookmarkPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { listSavedViews, saveView, renameView, deleteView } from "@/lib/saved-views.functions";
import type { ViewFilters } from "@/lib/saved-views";

export function SavedViews({ scope, filters, onApply }: { scope: "enquiries" | "payments"; filters: ViewFilters; onApply: (filters: ViewFilters) => void }) {
  const qc = useQueryClient();
  const load = useServerFn(listSavedViews), save = useServerFn(saveView), rename = useServerFn(renameView), remove = useServerFn(deleteView);
  const { data = [], isPending, isError, refetch } = useQuery({ queryKey: ["admin-saved-views", scope], queryFn: () => load({ data: { scope } }) });
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState<"save" | "rename" | "delete" | null>(null);
  const [name, setName] = useState("");
  const current = data.find((v) => v.id === selected);
  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === "save") return save({ data: { scope, name, filters } });
      if (!current) throw new Error("Select a saved view first.");
      if (mode === "rename") return rename({ data: { id: current.id, name } });
      return remove({ data: { id: current.id } });
    },
    onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["admin-saved-views", scope] }); if (mode === "delete") setSelected(""); setMode(null); },
  });
  const start = (value: typeof mode) => { mutation.reset(); setName(value === "rename" ? current?.name ?? "" : ""); setMode(value); };
  return <div className="my-4">
    <div className="flex flex-wrap items-center gap-2">
      <label className="w-full min-w-0 sm:w-auto sm:flex-1 sm:max-w-64"><span className="sr-only">Saved views</span><select aria-label="Saved views" className="field !min-h-11 !py-2 text-sm" value={selected} disabled={isPending || isError} onChange={(e) => { setSelected(e.target.value); const view = data.find((v) => v.id === e.target.value); if (view) onApply(view.filters); }}><option value="">{isPending ? "Loading saved views…" : "Saved views"}</option>{data.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
      <Button variant="outline" onClick={() => start("save")}><BookmarkPlus className="h-4 w-4" />Save view</Button>
      {current && <><Button variant="ghost" size="icon" aria-label="Rename saved view" title="Rename saved view" onClick={() => start("rename")}><Pencil /></Button><Button variant="ghost" size="icon" aria-label="Delete saved view" title="Delete saved view" onClick={() => start("delete")}><Trash2 /></Button></>}
    </div>
    {isError && <div role="alert" className="mt-2 text-sm text-destructive">Couldn’t load saved views. <Button variant="ghost" onClick={() => refetch()}>Try again</Button></div>}
    <Dialog open={mode !== null} onOpenChange={(open) => { if (!open && !mutation.isPending) setMode(null); }}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-lg">
        <DialogTitle>{mode === "save" ? "Save current view" : mode === "rename" ? "Rename saved view" : "Delete saved view?"}</DialogTitle>
        <DialogDescription>{mode === "delete" ? `Remove “${current?.name ?? ""}”? Your records will not be deleted.` : "Saved to your admin account. Date ranges keep the exact dates selected."}</DialogDescription>
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
          {mode !== "delete" && <label className="block text-sm">View name<Input aria-label="View name" className="mt-2" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} /></label>}
          {mutation.isError && <p role="alert" className="text-sm text-destructive">{mutation.error.message}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="ghost" disabled={mutation.isPending} onClick={() => setMode(null)}>Cancel</Button><Button type="submit" disabled={mutation.isPending || (mode !== "delete" && !name.trim())}>{mutation.isPending ? "Saving…" : mode === "delete" ? "Delete view" : "Save"}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}