import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash2, Upload, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export type CrudField = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number" | "image" | "media";
  placeholder?: string;
};

export type CrudItem = Record<string, any> & { id: string };

type Props<T extends CrudItem> = {
  title: string;
  description?: string;
  fields: CrudField[];
  initial: T[];
  columns?: { key: string; label: string }[];
  onSave?: (item: Partial<T>, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onUpload?: (file: File) => Promise<string>;
  extraActions?: React.ReactNode;
  hideNewEntry?: boolean;
};

export function CrudManager<T extends CrudItem>({
  title,
  description,
  fields,
  initial,
  columns,
  onSave,
  onDelete,
  onUpload,
  extraActions,
  hideNewEntry,
}: Props<T>) {
  const [items, setItems] = useState<T[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  const cols = columns ?? fields.slice(0, 4).map((f) => ({ key: f.key, label: f.label }));

  const startCreate = () => {
    setEditing(null);
    setForm({});
    setOpen(true);
  };
  const startEdit = (item: T) => {
    setEditing(item);
    const f: Record<string, any> = {};
    fields.forEach((fi) => (f[fi.key] = item[fi.key] ?? ""));
    setForm(f);
    setOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setUploading(key);
    try {
      const url = await onUpload(file);
      setForm((s) => ({ ...s, [key]: url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const remove = async (id: string) => {
    if (onDelete) {
      try {
        await onDelete(id);
        toast.success("Deleted");
      } catch (e) {
        toast.error("Failed to delete");
      }
    } else {
      setItems((s) => s.filter((i) => i.id !== id));
      toast.success("Deleted");
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(form as Partial<T>, editing?.id);
        toast.success(editing ? "Updated" : "Added");
      } else {
        if (editing) {
          setItems((s) => s.map((i) => (i.id === editing.id ? ({ ...i, ...form } as T) : i)));
          toast.success("Updated");
        } else {
          const next = { id: crypto.randomUUID(), ...form } as T;
          setItems((s) => [next, ...s]);
          toast.success("Added");
        }
      }
      setOpen(false);
    } catch (e) {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="size-5 text-primary animate-pulse" />
            <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
          </div>
          {description && <p className="text-slate-500 font-medium">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
          {extraActions}
          {!hideNewEntry && (
            <button
              onClick={startCreate}
              className="premium-button flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white shadow-lg"
            >
              <Plus className="size-4" /> New Entry
            </button>
          )}
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-900/5 bg-white/70 backdrop-blur-xl">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {cols.map((c) => (
                  <th key={c.key} className="px-3 sm:px-4 lg:px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="px-3 sm:px-4 lg:px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td
                      colSpan={cols.length + 1}
                      className="px-6 py-20 text-center"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300">
                          <Loader2 className="size-8 opacity-20" />
                        </div>
                        <p className="text-slate-400 font-medium italic mt-2">No items found yet...</p>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  items.map((it, i) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      key={it.id}
                      className="group border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      {cols.map((c) => {
                        const field = fields.find((f) => f.key === c.key);
                        const isImage =
                          field?.type === "image" ||
                          field?.type === "media" ||
                          c.key.toLowerCase().includes("image") ||
                          c.key.toLowerCase().includes("photo") ||
                          c.key.toLowerCase().includes("url") ||
                          c.key.toLowerCase().includes("avatar") ||
                          (typeof it[c.key] === "string" && (it[c.key].startsWith("http") || it[c.key].startsWith("data:image")));

                        const isVideo = typeof it[c.key] === "string" && (it[c.key].includes(".mp4") || it[c.key].includes(".webm") || it[c.key].includes("videos%2F"));

                        return (
                          <td key={c.key} className="px-3 sm:px-4 lg:px-6 py-4">
                            {isImage ? (
                              <div className="size-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                {it[c.key] ? (
                                  (typeof it[c.key] === "string" && !it[c.key].startsWith("http") && !it[c.key].startsWith("data:")) ? (
                                    <span className="font-display font-black text-slate-500 text-sm">{it[c.key]}</span>
                                  ) : isVideo ? (
                                    <video src={String(it[c.key])} className="size-full object-cover" muted playsInline />
                                  ) : (
                                    <img
                                      src={String(it[c.key])}
                                      alt=""
                                      className="size-full object-cover"
                                    />
                                  )
                                ) : (
                                  <Upload className="size-4 text-slate-300" />
                                )}
                              </div>
                            ) : (
                              <div className="text-sm font-semibold text-slate-700 max-w-[150px] sm:max-w-[200px] lg:max-w-[250px] truncate" title={String(it[c.key] ?? "")}>
                                {String(it[c.key] ?? "")}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-3 sm:px-4 lg:px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-2">
                          <button
                            className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-md transition-all active:scale-90"
                            onClick={() => startEdit(it)}
                            aria-label="Edit"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-md transition-all active:scale-90"
                            onClick={() => remove(it.id)}
                            aria-label="Delete"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-2xl border-slate-200 shadow-2xl rounded-[2.5rem] max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="p-8 pb-4 border-b border-slate-100">
            <DialogTitle className="font-display text-2xl font-black text-slate-900 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {editing ? <Pencil className="size-5 text-primary" /> : <Plus className="size-5 text-primary" />}
              </div>
              {editing ? "Update Record" : "Create New Record"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.key} className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">{f.label}</Label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.key}
                    placeholder={f.placeholder}
                    rows={4}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-300"
                  />
                ) : (f.type === "image" || f.type === "media") ? (
                  <div className="space-y-3">
                    {form[f.key] ? (
                      <div className="space-y-3">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group cursor-pointer"
                        >
                          {form[f.key].includes("videos%2F") || form[f.key].includes(".mp4") || form[f.key].includes(".webm") ? (
                            <video src={form[f.key]} className={`size-full object-cover transition-all duration-700 ${uploading === f.key ? 'scale-100 opacity-40 blur-sm' : 'group-hover:scale-110'}`} muted playsInline />
                          ) : (
                            <img src={form[f.key]} alt="Preview" className={`size-full object-cover transition-all duration-700 ${uploading === f.key ? 'scale-100 opacity-40 blur-sm' : 'group-hover:scale-110'}`} />
                          )}
                          
                          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none z-10 ${uploading === f.key ? 'opacity-100' : 'bg-black/50 opacity-0 group-hover:opacity-100'}`}>
                            {uploading === f.key ? (
                              <div className="flex flex-col items-center text-primary drop-shadow-md bg-white/90 px-6 py-4 rounded-2xl shadow-xl">
                                <Loader2 className="size-8 mb-2 animate-spin" />
                                <span className="text-sm font-bold">Uploading New Image...</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-white drop-shadow-md">
                                <Upload className="size-8 mb-2" />
                                <span className="text-sm font-bold tracking-wide">Drag & Drop or Click to Replace</span>
                              </div>
                            )}
                          </div>

                          <input
                            type="file"
                            accept={f.type === "media" ? "image/*,video/*" : "image/*"}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                            title="Drag and drop or click to replace media"
                            disabled={!!uploading}
                            onClick={(e) => { (e.target as HTMLInputElement).value = "" }}
                            onChange={(e) => handleFileUpload(e, f.key)}
                          />
                        </motion.div>
                        <div className="relative inline-block">
                          <label
                            className={`premium-button flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white shadow-md active:scale-95 transition-all cursor-pointer ${uploading === f.key ? 'opacity-50 pointer-events-none' : ''}`}
                          >
                            {uploading === f.key ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                Changing Media...
                              </>
                            ) : (
                              <>
                                <Upload className="size-3.5" />
                                Change Media
                              </>
                            )}
                            <input
                              type="file"
                              accept={f.type === "media" ? "image/*,video/*" : "image/*"}
                              className="hidden"
                              disabled={!!uploading}
                              onClick={(e) => { (e.target as HTMLInputElement).value = "" }}
                              onChange={(e) => handleFileUpload(e, f.key)}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-primary/50 transition-all bg-slate-50/50 cursor-pointer">
                        <input
                          type="file"
                          accept={f.type === "media" ? "image/*,video/*" : "image/*"}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          disabled={!!uploading}
                          onClick={(e) => { (e.target as HTMLInputElement).value = "" }}
                          onChange={(e) => handleFileUpload(e, f.key)}
                        />
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {uploading === f.key ? (
                            <>
                              <Loader2 className="size-8 text-primary animate-spin" />
                              <span className="text-sm font-bold text-slate-700">Uploading to Storage...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="size-8 text-slate-400" />
                              <span className="text-sm font-bold text-slate-700">Click to Upload {f.type === "media" ? "Media" : "Image"}</span>
                              <span className="text-xs text-slate-400">{f.type === "media" ? "PNG, JPG, MP4, WEBM up to 50MB" : "PNG, JPG, JPEG up to 10MB"}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    id={f.key}
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-3.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all placeholder:text-slate-300"
                  />
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="p-8 pt-4 border-t border-slate-100 bg-slate-50/30 flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={loading}
              className="premium-button px-10 py-3 rounded-2xl text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl disabled:opacity-50"
            >
              {loading ? "Syncing..." : editing ? "Update" : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.section>
  );
}
