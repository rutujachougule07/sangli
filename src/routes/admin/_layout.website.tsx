import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getFoundersSnapshot, saveFounders, uploadImage, getSuccessStories, saveSuccessStory, updateSuccessStory, deleteSuccessStory, uploadSuccessStoryFile } from "@/lib/firebase-utils";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { TESTIMONIALS } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Globe, Save } from "lucide-react";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/_layout/website")({
  component: WebsiteSettingsPage,
});

function WebsiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingF1, setUploadingF1] = useState(false);
  const [uploadingF2, setUploadingF2] = useState(false);
  const [isDraggingF1, setIsDraggingF1] = useState(false);
  const [isDraggingF2, setIsDraggingF2] = useState(false);
  
  const [successStories, setSuccessStories] = useState<CrudItem[]>([]);

  const [formData, setFormData] = useState({
    f1Name: translations.en.founders.f1Name,
    f1NameMr: translations.mr.founders.f1Name,
    f1Desc: translations.en.founders.f1Desc,
    f1DescMr: translations.mr.founders.f1Desc,
    f1Image: "/images/founder1.jpeg",
    f2Name: translations.en.founders.f2Name,
    f2NameMr: translations.mr.founders.f2Name,
    f2Desc: translations.en.founders.f2Desc,
    f2DescMr: translations.mr.founders.f2Desc,
    f2Image: "/images/founder2.jpeg",
  });

  useEffect(() => {
    const unsubscribe = getFoundersSnapshot((data) => {
      if (data) {
        setFormData((prev) => ({
          ...prev,
          ...data,
        }));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = getSuccessStories((data) => {
      setSuccessStories(data as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, founderNum: 1 | 2) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (founderNum === 1) setUploadingF1(true);
    else setUploadingF2(true);

    try {
      const url = await uploadImage(file, "founders");
      setFormData((prev) => ({
        ...prev,
        [founderNum === 1 ? "f1Image" : "f2Image"]: url,
      }));
      toast.success(`Founder ${founderNum} image uploaded successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      if (founderNum === 1) setUploadingF1(false);
      else setUploadingF2(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, founderNum: 1 | 2) => {
    e.preventDefault();
    if (founderNum === 1) setIsDraggingF1(false);
    else setIsDraggingF2(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file");
      return;
    }

    if (founderNum === 1) setUploadingF1(true);
    else setUploadingF2(true);

    try {
      const url = await uploadImage(file, "founders");
      setFormData((prev) => ({
        ...prev,
        [founderNum === 1 ? "f1Image" : "f2Image"]: url,
      }));
      toast.success(`Founder ${founderNum} image uploaded successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image");
    } finally {
      if (founderNum === 1) setUploadingF1(false);
      else setUploadingF2(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveFounders(formData);
      toast.success("Website settings saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStory = async (data: any, id?: string) => {
    if (id) {
      await updateSuccessStory(id, data);
    } else {
      await saveSuccessStory(data);
    }
  };

  const handleDeleteStory = async (id: string) => {
    await deleteSuccessStory(id);
  };

  const handleUploadStory = async (file: File) => {
    return await uploadSuccessStoryFile(file);
  };

  const migrateOldData = async () => {
    if (confirm("Are you sure you want to seed the original hardcoded success stories? This will add " + TESTIMONIALS.length + " items to Firebase.")) {
      try {
        for (const t of TESTIMONIALS) {
          await saveSuccessStory({
            name: t.name || "",
            name_mr: t.name_mr || "",
            role: t.role || "",
            role_mr: t.role_mr || "",
            text: t.content || "",
            text_mr: t.content_mr || "",
            avatar: t.avatar || "",
          });
        }
        toast.success("Migration complete!");
      } catch (err) {
        console.error("Migration failed:", err);
        toast.error("Migration failed. See console.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Globe className="size-8 text-primary" /> Website Settings
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage dynamic sections of the website content.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary hover:bg-primary/95 text-white shadow-md font-semibold px-6 py-5 flex items-center gap-2"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Founder 1 */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8">
            <CardTitle className="text-xl font-bold text-slate-800">Founder 1 (Primary Founder)</CardTitle>
            <CardDescription>Edit details for Dr. Kusumtai Ghanekar or primary founder profile.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div 
                className={cn(
                  "relative size-32 rounded-2xl overflow-hidden border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                  isDraggingF1 ? "border-dashed border-primary bg-primary/5 scale-105" : "border-slate-100"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingF1(true);
                }}
                onDragLeave={() => setIsDraggingF1(false)}
                onDrop={(e) => handleDrop(e, 1)}
              >
                <img
                  src={formData.f1Image}
                  alt="Founder 1 Preview"
                  className="w-full h-full object-cover"
                />
                {isDraggingF1 && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center text-xs font-bold text-primary text-center p-2">
                    Drop Here
                  </div>
                )}
                {uploadingF1 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2 w-full">
                <Label 
                  htmlFor="f1-image-input" 
                  className="cursor-pointer block"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingF1(true);
                  }}
                  onDragLeave={() => setIsDraggingF1(false)}
                  onDrop={(e) => handleDrop(e, 1)}
                >
                  <div className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-all duration-300",
                    isDraggingF1 ? "border-dashed border-primary bg-primary/5 text-primary scale-[1.02]" : "border-slate-200"
                  )}>
                    <Upload className="size-4 animate-bounce" /> {isDraggingF1 ? "Drop Photo Now" : "Upload / Drag Photo"}
                  </div>
                  <Input
                    id="f1-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 1)}
                    className="hidden"
                  />
                </Label>
                <p className="text-[11px] text-slate-400">
                  Recommended size: Square aspect ratio (e.g. 400x400)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name (English)</Label>
                <Input
                  name="f1Name"
                  value={formData.f1Name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Kusumtai Ghanekar"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name (Marathi)</Label>
                <Input
                  name="f1NameMr"
                  value={formData.f1NameMr}
                  onChange={handleChange}
                  placeholder="उदा. डॉ. कुसुमताई घाणेकर"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description (English)</Label>
                <Textarea
                  name="f1Desc"
                  value={formData.f1Desc}
                  onChange={handleChange}
                  placeholder="Founder bio description..."
                  rows={4}
                  className="rounded-xl border-slate-200 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description (Marathi)</Label>
                <Textarea
                  name="f1DescMr"
                  value={formData.f1DescMr}
                  onChange={handleChange}
                  placeholder="संस्थापकांबद्दल माहिती..."
                  rows={4}
                  className="rounded-xl border-slate-200 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Founder 2 */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 sm:p-8">
            <CardTitle className="text-xl font-bold text-slate-800">Founder 2 (Co-Founder)</CardTitle>
            <CardDescription>Edit details for Kamaltai Jog or co-founder profile.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div 
                className={cn(
                  "relative size-32 rounded-2xl overflow-hidden border-2 flex items-center justify-center shrink-0 transition-all duration-300",
                  isDraggingF2 ? "border-dashed border-primary bg-primary/5 scale-105" : "border-slate-100"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingF2(true);
                }}
                onDragLeave={() => setIsDraggingF2(false)}
                onDrop={(e) => handleDrop(e, 2)}
              >
                <img
                  src={formData.f2Image}
                  alt="Founder 2 Preview"
                  className="w-full h-full object-cover"
                />
                {isDraggingF2 && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center text-xs font-bold text-primary text-center p-2">
                    Drop Here
                  </div>
                )}
                {uploadingF2 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div className="space-y-2 w-full">
                <Label 
                  htmlFor="f2-image-input" 
                  className="cursor-pointer block"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingF2(true);
                  }}
                  onDragLeave={() => setIsDraggingF2(false)}
                  onDrop={(e) => handleDrop(e, 2)}
                >
                  <div className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600 transition-all duration-300",
                    isDraggingF2 ? "border-dashed border-primary bg-primary/5 text-primary scale-[1.02]" : "border-slate-200"
                  )}>
                    <Upload className="size-4 animate-bounce" /> {isDraggingF2 ? "Drop Photo Now" : "Upload / Drag Photo"}
                  </div>
                  <Input
                    id="f2-image-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 2)}
                    className="hidden"
                  />
                </Label>
                <p className="text-[11px] text-slate-400">
                  Recommended size: Square aspect ratio (e.g. 400x400)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name (English)</Label>
                <Input
                  name="f2Name"
                  value={formData.f2Name}
                  onChange={handleChange}
                  placeholder="e.g. Kamaltai Jog"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Name (Marathi)</Label>
                <Input
                  name="f2NameMr"
                  value={formData.f2NameMr}
                  onChange={handleChange}
                  placeholder="उदा. कमलताई जोग"
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description (English)</Label>
                <Textarea
                  name="f2Desc"
                  value={formData.f2Desc}
                  onChange={handleChange}
                  placeholder="Co-founder bio description..."
                  rows={4}
                  className="rounded-xl border-slate-200 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description (Marathi)</Label>
                <Textarea
                  name="f2DescMr"
                  value={formData.f2DescMr}
                  onChange={handleChange}
                  placeholder="सह-संस्थापकांबद्दल माहिती..."
                  rows={4}
                  className="rounded-xl border-slate-200 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Success Stories Section */}
      <div className="pt-12 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Success Stories</h2>
            <p className="text-slate-500 text-sm mt-1">Manage the success stories displayed on the homepage.</p>
          </div>
          {successStories.length === 0 && (
            <Button onClick={migrateOldData} variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50">
              Seed Original Success Stories
            </Button>
          )}
        </div>
        
        <CrudManager<CrudItem>
          title="Success Stories"
          description=""
          initial={successStories}
          onSave={handleSaveStory}
          onDelete={handleDeleteStory}
          onUpload={handleUploadStory}
          fields={[
            { key: "avatar", label: "Media (Image/Video URL or Initials)", type: "media" },
            { key: "name", label: "Name (English)" },
            { key: "name_mr", label: "नाव (Marathi)" },
            { key: "role", label: "Role (English)", placeholder: "e.g. Graphic Designer, Caretaker" },
            { key: "role_mr", label: "भूमिका (Marathi)", placeholder: "उदा. ग्राफिक डिझायनर" },
            { key: "text", label: "Story Content (English)", type: "textarea" },
            { key: "text_mr", label: "कथा (Marathi)", type: "textarea" },
          ]}
          columns={[
            { key: "avatar", label: "Media" },
            { key: "name", label: "Name (EN)" },
            { key: "name_mr", label: "नाव (MR)" },
            { key: "role", label: "Role" },
          ]}
        />
      </div>
    </div>
  );
}
