import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  uploadImage,
} from "@/lib/firebase-utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_layout/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  const [items, setItems] = useState<CrudItem[]>([]);

  useEffect(() => {
    const unsubscribe = getCourses((data) => {
      const sorted = [...data].sort((a: any, b: any) => (Number(a.no) || 0) - (Number(b.no) || 0));
      setItems(sorted as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (data: any, id?: string) => {
    const fieldsToTranslate = ["name", "eligibility", "duration", "accreditation", "fees", "format", "description"];
    
    const translateToMarathi = async (text: string) => {
      if (!text) return "";
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodeURIComponent(text)}`);
        const json = await res.json();
        return json[0].map((item: any) => item[0]).join("");
      } catch (e) {
        console.error("Translation error:", e);
        return "";
      }
    };

    const loadingId = toast.loading("Saving and auto-translating to Marathi...");

    try {
      for (const field of fieldsToTranslate) {
        const mrField = `${field}_mr`;
        if (data[field] && !data[mrField]) {
          data[mrField] = await translateToMarathi(data[field]);
        }
      }

      if (id) {
        await updateCourse(id, data);
      } else {
        await addCourse(data);
      }
      toast.dismiss(loadingId);
    } catch (error) {
      toast.dismiss(loadingId);
      console.error(error);
      toast.error("Failed to save course");
    }
  };

  const handleDelete = async (id: string) => {
    await deleteCourse(id);
  };

  const handleUpload = async (file: File) => {
    return await uploadImage(file, "courses");
  };


  return (
    <CrudManager<CrudItem>
      title="Courses"
      description="Add, edit and remove professional and vocational courses."
      initial={items}
      onSave={handleSave}
      onDelete={handleDelete}
      onUpload={handleUpload}
      fields={[
        { key: "no", label: "No. (क्रमांक)" },
        { key: "name", label: "Course Name (EN)" },
        { key: "name_mr", label: "Course Name (MR)" },
        { key: "eligibility", label: "Eligibility (EN)" },
        { key: "eligibility_mr", label: "Eligibility (MR)" },
        { key: "duration", label: "Duration (EN)" },
        { key: "duration_mr", label: "Duration (MR)" },
        { key: "accreditation", label: "Accreditation (EN)" },
        { key: "accreditation_mr", label: "Accreditation (MR)" },
        { key: "fees", label: "Annual fees (EN)" },
        { key: "fees_mr", label: "Annual fees (MR)" },
        { key: "format", label: "Format (EN)" },
        { key: "format_mr", label: "Format (MR)" },
        { key: "description", label: "Description (EN)", type: "textarea" },
        { key: "description_mr", label: "Description (MR)", type: "textarea" },
        { key: "image", label: "Course Image", type: "image" },
      ]}
      columns={[
        { key: "no", label: "No." },
        { key: "image", label: "Image" },
        { key: "name", label: "Course Name" },
        { key: "eligibility", label: "Eligibility" },
        { key: "duration", label: "Duration" },
        { key: "accreditation", label: "Accreditation" },
        { key: "fees", label: "Annual fees" },
        { key: "format", label: "Format" },
      ]}
    />
  );
}
