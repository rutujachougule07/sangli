import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle, Trash2, ImageIcon, X, Sparkles, Image as LucideImage, Film, RefreshCw, Database, HardDrive } from "lucide-react";
import { toast } from "sonner";
import {
  uploadGalleryFile,
  listGalleryFiles,
  deleteGalleryFile,
  getGalleryItems,
  deleteGalleryItem,
  updateGalleryFileMetadata,
  updateGalleryItem,
} from "@/lib/firebase-utils";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/_layout/gallery")({
  component: GalleryPage,
});

type StorageFile = { name: string; url: string; fullPath: string; isVideo: boolean; source: 'storage' | 'firestore'; firestoreId?: string; customTitle?: string; customTitle_mr?: string };

function GalleryPage() {
  const [storageItems, setStorageItems] = useState<StorageFile[]>([]);
  const [firestoreItems, setFirestoreItems] = useState<StorageFile[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewIsVideo, setPreviewIsVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit States
  const [editingItem, setEditingItem] = useState<StorageFile | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTitleMr, setEditTitleMr] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (editFilePreview) {
        URL.revokeObjectURL(editFilePreview);
      }
    };
  }, [editFilePreview]);

  // Merge both sources. They are already fetched in descending timestamp order from Firebase.
  // We preserve this natural sequence as requested by the user.
  const items = [...storageItems, ...firestoreItems];

  const fetchStorageFiles = useCallback(async () => {
    setLoading(true);
    try {
      const files = await listGalleryFiles();
      setStorageItems(files.map(f => ({
        ...f,
        source: 'storage' as const,
        name: f.customTitle || f.name.replace(/^\d+_/, '').replace(/\.[^.]+$/, '')
      })));
    } catch (error) {
      console.error("Failed to load storage gallery:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from Firestore (old items)
  useEffect(() => {
    const unsubscribe = getGalleryItems((data) => {
      const mapped: StorageFile[] = data.map((it: any) => ({
        name: it.title || 'Untitled',
        url: it.url || it.newsLink || '',
        fullPath: '',
        isVideo: /\.(mp4|webm|ogg|mov)($|\?)/i.test(it.url || '') || /\.(mp4|webm|ogg|mov)($|\?)/i.test(it.newsLink || ''),
        source: 'firestore' as const,
        firestoreId: it.id,
      }));
      setFirestoreItems(mapped);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchStorageFiles();
  }, [fetchStorageFiles]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadGalleryFile(file);
      if (file.type.startsWith("video/")) {
        setPreview(url);
        setPreviewIsVideo(true);
      } else {
        setPreview(url);
        setPreviewIsVideo(false);
      }
      toast.success("Uploaded to Storage!");
      await fetchStorageFiles();
      setShowForm(false);
      setPreview(null);
      setPreviewIsVideo(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (item: StorageFile) => {
    try {
      if (item.source === 'storage') {
        await deleteGalleryFile(item.fullPath);
        toast.success("Removed from Storage");
        await fetchStorageFiles();
      } else if (item.source === 'firestore' && item.firestoreId) {
        await deleteGalleryItem(item.firestoreId, item.url);
        toast.success("Removed from Firestore");
      }
    } catch {
      toast.error("Failed to remove");
    }
  };

  const openEdit = (item: StorageFile) => {
    setEditingItem(item);
    setEditTitle(item.customTitle || item.name);
    setEditTitleMr(item.customTitle_mr || "");
    setEditFile(null);
    setEditFilePreview(null);
  };

  const closeEdit = () => {
    if (editFilePreview) {
      URL.revokeObjectURL(editFilePreview);
    }
    setEditingItem(null);
    setEditFile(null);
    setEditFilePreview(null);
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEditFile(file);
    if (editFilePreview) {
      URL.revokeObjectURL(editFilePreview);
    }
    setEditFilePreview(URL.createObjectURL(file));
  };

  const handleEditDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (savingEdit) return;
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please drop an image or video file');
      return;
    }
    setEditFile(file);
    if (editFilePreview) {
      URL.revokeObjectURL(editFilePreview);
    }
    setEditFilePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    setSavingEdit(true);
    try {
      let finalTitle = editTitle.trim();
      let finalTitleMr = editTitleMr.trim();

      const translateTo = async (text: string, targetLang: string) => {
        if (!text) return "";
        try {
          const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
          const json = await res.json();
          return json[0].map((item: any) => item[0]).join("");
        } catch (e) {
          console.error("Translation error:", e);
          return "";
        }
      };

      if (finalTitle && !finalTitleMr) {
        finalTitleMr = await translateTo(finalTitle, "mr");
      } else if (!finalTitle && finalTitleMr) {
        finalTitle = await translateTo(finalTitleMr, "en");
      }

      if (editingItem.source === 'storage') {
        if (editFile) {
          await uploadGalleryFile(editFile, finalTitle, finalTitleMr);
          await deleteGalleryFile(editingItem.fullPath);
          toast.success("Storage file replaced & title updated!");
        } else {
          await updateGalleryFileMetadata(editingItem.fullPath, finalTitle, finalTitleMr);
          toast.success("Storage title updated!");
        }
        await fetchStorageFiles();
      } else if (editingItem.source === 'firestore' && editingItem.firestoreId) {
        if (editFile) {
          const newUrl = await uploadGalleryFile(editFile, finalTitle, finalTitleMr);
          await updateGalleryItem(editingItem.firestoreId, {
            url: newUrl,
            title: finalTitle,
            title_mr: finalTitleMr
          });
          toast.success("Firestore media & title updated!");
        } else {
          await updateGalleryItem(editingItem.firestoreId, { title: finalTitle, title_mr: finalTitleMr });
          toast.success("Firestore title updated!");
        }
      }
      closeEdit();
    } catch (error) {
      console.error("Failed to update item:", error);
      toast.error("Failed to update item");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Sparkles className="size-5 text-primary animate-pulse" />
            <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight">Gallery Content</h2>
          </div>
          <p className="text-slate-500 font-medium">
            Upload images & videos — stored directly in Firebase Storage.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchStorageFiles}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold text-slate-600 border border-slate-200 hover:border-primary/30 hover:text-primary transition-all active:scale-95"
          >
            <RefreshCw className="size-4" /> Refresh
          </button>
          <button onClick={() => { setShowForm(true); setPreview(null); setPreviewIsVideo(false); }} className="premium-button flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold text-white shadow-xl active:scale-95 transition-transform">
            <PlusCircle className="size-4" /> Add To Gallery
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => !uploading && setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-[2.5rem] p-0 w-full max-w-xl relative z-10 overflow-hidden shadow-2xl bg-white/95"
            >
              <div className="p-8 pb-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LucideImage className="size-5 text-primary" />
                  </div>
                  Upload to Gallery
                </h3>
                <button
                  onClick={() => !uploading && setShowForm(false)}
                  className="size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Upload File Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Select Photo or Video
                  </label>
                  <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-primary/50 transition-all bg-slate-50/50 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      onClick={(e) => { (e.target as HTMLInputElement).value = "" }}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                      title="Drag and drop or click to upload"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <PlusCircle className={`size-10 ${uploading ? 'text-primary animate-spin' : 'text-slate-400'}`} />
                      <span className="text-sm font-bold text-slate-700">
                        {uploading ? "Uploading to Storage..." : "Click or Drag to Upload"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Images & Videos → Direct to Firebase Storage
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <AnimatePresence>
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="rounded-3xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video shadow-inner relative"
                    >
                      {previewIsVideo ? (
                        <video src={preview} controls className="size-full object-contain bg-black" />
                      ) : (
                        <img src={preview} alt="Preview" className="size-full object-cover" />
                      )}
                      <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                        ✓ Uploaded to Storage
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 pt-4 border-t border-slate-100 bg-slate-50/30 flex gap-4">
                <button
                  onClick={() => !uploading && setShowForm(false)}
                  className="flex-1 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="py-32 flex flex-col items-center text-center">
          <RefreshCw className="size-8 text-primary animate-spin mb-4" />
          <p className="text-slate-400 font-bold">Loading from Storage...</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 pb-20"
        >
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 flex flex-col items-center text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200"
              >
                <div className="size-20 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-6 text-slate-200">
                  <ImageIcon className="size-10" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-400 mb-2">Storage is empty</h3>
                <p className="text-slate-400 text-sm">Upload your first image or video to get started.</p>
              </motion.div>
            ) : (
              items.map((it, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={it.source === 'firestore' ? it.firestoreId : it.fullPath}
                  className="glass-card rounded-[2rem] overflow-hidden group relative shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col bg-white"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
                    {it.isVideo ? (
                      <video
                        src={it.url}
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                        preload="metadata"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={it.url}
                        alt={it.name}
                        loading="lazy"
                        className="size-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    )}

                    {/* Video badge */}
                    {it.isVideo && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Film className="size-3" /> Video
                      </div>
                    )}

                    {/* Dark gradient overlay on hover inside the media container */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                    {/* Edit button on the bottom-left of the media container */}
                    <div className="absolute bottom-3 left-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button
                        onClick={() => openEdit(it)}
                        className="size-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl text-slate-600 cursor-pointer"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </div>

                    {/* Delete button on the bottom-right of the media container */}
                    <div className="absolute bottom-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                      <button
                        onClick={() => remove(it)}
                        className="size-9 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl text-slate-600 cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Caption / Title Footer */}
                  <div className="p-3.5 bg-white border-t border-slate-50 flex-1 flex items-center justify-center">
                    <p className={`text-[11px] font-bold text-center line-clamp-2 ${it.customTitle ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {it.customTitle || it.name}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Edit Gallery Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={() => !savingEdit && closeEdit()}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card rounded-[2rem] p-0 w-full max-w-lg relative z-10 overflow-hidden shadow-2xl bg-white/95"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-display text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Pencil className="size-5" />
                  </div>
                  Edit Gallery Item
                </h3>
                <button
                  onClick={() => !savingEdit && closeEdit()}
                  className="size-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Media Preview & Change */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Media File (Image or Video)
                  </label>
                  <div 
                    className="relative h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-inner group/preview"
                    onDrop={handleEditDrop}
                    onDragOver={handleDragOver}
                  >
                    {editFilePreview ? (
                      editFile?.type.startsWith("video/") ? (
                        <video src={editFilePreview} controls className="size-full object-cover bg-black" />
                      ) : (
                        <img src={editFilePreview} alt="New preview" className="size-full object-cover transition-all duration-700 group-hover/preview:scale-110" />
                      )
                    ) : (
                      editingItem.isVideo ? (
                        <video src={editingItem.url} controls className="size-full object-cover bg-black" />
                      ) : (
                        <img src={editingItem.url} alt={editingItem.name} className="size-full object-cover transition-all duration-700 group-hover/preview:scale-110" />
                      )
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                      <div className="flex flex-col items-center text-white drop-shadow-md">
                        <RefreshCw className="size-8 mb-2" />
                        <span className="text-sm font-bold tracking-wide">Drag & Drop or Click Button to Replace</span>
                      </div>
                    </div>

                    {/* Change Media Button Overlay */}
                    <label className="absolute bottom-3 right-3 bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/60 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg text-xs font-bold text-slate-700 cursor-pointer transition-all active:scale-95 z-50">
                      <RefreshCw className="size-3.5 text-primary" />
                      Change Media
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleEditFileChange}
                        onClick={(e) => { (e.target as HTMLInputElement).value = "" }}
                        className="hidden"
                        disabled={savingEdit}
                      />
                    </label>
                  </div>
                </div>

                {/* Caption / Title */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Caption / Title (EN)
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all"
                      placeholder="Enter image caption in English..."
                      disabled={savingEdit}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                      Caption / Title (MR)
                    </label>
                    <input
                      type="text"
                      value={editTitleMr}
                      onChange={(e) => setEditTitleMr(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all"
                      placeholder="Enter image caption in Marathi..."
                      disabled={savingEdit}
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50/30 flex gap-4">
                <button
                  onClick={closeEdit}
                  className="flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="premium-button flex-1 py-3 rounded-xl text-sm font-black uppercase tracking-[0.2em] text-white shadow-xl active:scale-[0.98]"
                >
                  {savingEdit ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
