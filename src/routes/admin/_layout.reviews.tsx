import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { getReviews, saveReview, updateReview, deleteReview, uploadReviewFile } from "@/lib/firebase-utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_layout/reviews")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const [items, setItems] = useState<CrudItem[]>([]);

  useEffect(() => {
    const unsubscribe = getReviews((data) => {
      setItems(data as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (data: any, id?: string) => {
    if (id) {
      await updateReview(id, data);
    } else {
      await saveReview(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteReview(id);
  };

  const handleUpload = async (file: File) => {
    return await uploadReviewFile(file);
  };

  return (
    <CrudManager<CrudItem>
      title="Testimonials / Reviews"
      description="Manage feedback from the community."
      initial={items}
      onSave={handleSave}
      onDelete={handleDelete}
      onUpload={handleUpload}
      fields={[
        { key: "avatar", label: "Media (Image/Video)", type: "media" },
        { key: "name", label: "Name (English)" },
        { key: "name_mr", label: "नाव (Marathi)" },
        { key: "role", label: "Role (English)", placeholder: "e.g. Student, Parent, Donor" },
        { key: "role_mr", label: "भूमिका (Marathi)", placeholder: "उदा. विद्यार्थी, पालक, दाता" },
        { key: "rating", label: "Rating (1-5)", type: "number" },
        { key: "text", label: "Review Content (English)", type: "textarea" },
        { key: "text_mr", label: "अभिप्राय (Marathi)", type: "textarea" },
      ]}
      columns={[
        { key: "avatar", label: "Media" },
        { key: "name", label: "Name (EN)" },
        { key: "name_mr", label: "नाव (MR)" },
        { key: "role", label: "Role" },
        { key: "rating", label: "Stars" },
      ]}
    />
  );
}
