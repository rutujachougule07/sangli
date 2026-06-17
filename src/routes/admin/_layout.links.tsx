import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, Link2, X, Youtube, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getGalleryItems, saveGalleryItem, deleteGalleryItem } from "@/lib/firebase-utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_layout/links")({
  component: LinksPage,
});

type LinkItem = { id: string; url: string; title: string; newsLink?: string };
type FormState = { url: string; title: string; newsLink: string };

const EMPTY: FormState = { url: "", title: "", newsLink: "" };

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function isYouTubeUrl(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}

function LinksPage() {
  const [items, setItems] = useState<LinkItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const isYT = isYouTubeUrl(form.newsLink);
  const ytThumb = isYT
    ? `https://img.youtube.com/vi/${getYouTubeId(form.newsLink)}/hqdefault.jpg`
    : null;

  useEffect(() => {
    const unsub = getGalleryItems((data) => {
      setItems(data.filter((d) => d.newsLink) as LinkItem[]);
    });
    return () => unsub();
  }, []);

  const handleNewsLinkChange = (val: string) => {
    const ytId = getYouTubeId(val);
    if (ytId) {
      const thumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      setForm((f) => ({ ...f, newsLink: val, url: thumb }));
      setPreview(thumb);
    } else {
      setForm((f) => ({ ...f, newsLink: val }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.newsLink.trim()) return toast.error("Article / YouTube URL is required");

    const finalUrl = isYT && ytThumb ? ytThumb : form.url.trim();

    setSaving(true);
    try {
      await saveGalleryItem({
        url: finalUrl,
        title: form.title.trim(),
        newsLink: form.newsLink.trim(),
      } as any);
      toast.success("Link added to gallery!");
      setForm(EMPTY);
      setPreview(null);
      setShowForm(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string, url: string) => {
    try {
      await deleteGalleryItem(id, url);
      toast.success("Removed");
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold">News Links</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add news articles or YouTube videos — they appear directly in the Gallery page.
          </p>
        </div>
        <Button
          className="rounded-full"
          onClick={() => {
            setForm(EMPTY);
            setPreview(null);
            setShowForm(true);
          }}
        >
          <PlusCircle className="size-4" /> Add Link
        </Button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="glass-card rounded-3xl p-8 w-full max-w-lg space-y-5 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY);
                setPreview(null);
              }}
              className="absolute top-5 right-5 size-8 rounded-full bg-card/60 flex items-center justify-center hover:bg-card transition-colors"
            >
              <X className="size-4" />
            </button>

            <h3 className="font-display text-xl font-semibold">Add News Link</h3>

            {/* News / YouTube Link — first so auto-fill works */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                News / YouTube Link *
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or news article URL"
                  value={form.newsLink}
                  onChange={(e) => handleNewsLinkChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {isYT && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                  <Youtube className="size-3.5" /> YouTube detected — thumbnail auto-filled!
                </p>
              )}
            </div>

            {/* Image URL — hidden for YouTube */}
            {!isYT && (
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Thumbnail Image URL (optional)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={form.url}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, url: e.target.value }));
                        setPreview(null);
                      }}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl shrink-0"
                    onClick={() => form.url.trim() && setPreview(form.url.trim())}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            )}

            {/* Preview */}
            {(preview || ytThumb) && (
              <div className="rounded-2xl overflow-hidden border border-border/60 bg-card/40">
                <img
                  src={preview || ytThumb!}
                  alt="Preview"
                  className="w-full max-h-48 object-contain"
                  onError={() => {
                    setPreview(null);
                  }}
                />
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name / Title *
              </label>
              <input
                type="text"
                placeholder="e.g. School Assembly News Headlines Apr 28"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl bg-card/60 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY);
                  setPreview(null);
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1 rounded-full" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Add to Gallery"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grid — same as Gallery */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.length === 0 && (
          <div className="col-span-full glass-card rounded-3xl p-12 text-center text-muted-foreground">
            <Link2 className="mx-auto size-8 mb-3" />
            <p>No links yet. Click "Add Link" to get started.</p>
          </div>
        )}
        {items.map((it) => (
          <div key={it.id} className="glass-card rounded-2xl overflow-hidden group relative">
            <div className="aspect-square bg-muted/20 flex items-center justify-center overflow-hidden">
              {it.url ? (
                <img
                  src={it.url}
                  alt={it.title}
                  loading="lazy"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <Link2 className="size-10 text-muted-foreground/40" />
              )}
            </div>

            {/* YouTube badge */}
            {isYouTubeUrl(it.newsLink || "") && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Youtube className="size-3" /> YT
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <div className="text-white text-sm font-medium truncate">{it.title}</div>
            </div>

            {/* Action buttons */}
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={it.newsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="size-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
              >
                <ExternalLink className="size-3.5 text-foreground" />
              </a>
              <button
                onClick={() => remove(it.id, it.url)}
                className="size-9 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
              >
                <Trash2 className="size-3.5 text-destructive" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
