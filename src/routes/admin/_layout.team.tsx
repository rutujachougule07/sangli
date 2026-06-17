import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { TEAM } from "@/lib/site-data";
import {
  getTeam,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage,
} from "@/lib/firebase-utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/_layout/team")({
  component: TeamPage,
});

function TeamPage() {
  const [items, setItems] = useState<CrudItem[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const unsubscribe = getTeam((data) => {
      const valid = data.filter((d: any) => d.name && d.name.trim() !== "");
      
      // Merge static TEAM with Firebase data
      const merged = TEAM.map((staticMember, i) => {
        const fireMember = valid.find((f: any) => f.name === staticMember.name);
        return fireMember ? { id: fireMember.id, ...staticMember, ...fireMember } : { id: `static-${i}`, ...staticMember };
      });
      
      // Add any totally new members from Firebase
      const newMembers = valid.filter((f: any) => !TEAM.some(t => t.name === f.name));
      
      setItems([...merged, ...newMembers] as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (data: any, id?: string) => {
    if (id && !id.startsWith("static-")) {
      // Real Firebase document ID → update
      await updateTeamMember(id, data);
    } else {
      // Fake numeric ID from static data → create new
      await addTeamMember(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTeamMember(id);
  };

  // Upload photo to Firebase Storage → returns download URL (not base64)
  const handleUpload = async (file: File): Promise<string> => {
    return await uploadImage(file, "team");
  };



  return (
    <CrudManager<CrudItem>
      title="Team Members"
      description="Profiles displayed on the About page."
      initial={
        items.length > 0
          ? items
          : (TEAM.map((t, i) => ({ id: `static-${i}`, ...t })) as unknown as CrudItem[])
      }
      onSave={handleSave}
      onDelete={handleDelete}
      onUpload={handleUpload}
      fields={[
        { key: "name", label: "Full name (English)" },
        { key: "name_mr", label: "पूर्ण नाव (Marathi)" },
        { key: "role", label: "Role" },
        { key: "initials", label: "Initials" },
        { key: "description", label: "Description (English)" },
        { key: "description_mr", label: "वर्णन (Marathi)" },
        { key: "url", label: "Photo", type: "image", placeholder: "https://example.com/photo.jpg" },
      ]}
      columns={[
        { key: "url", label: "Photo" },
        { key: "name", label: "Name (EN)" },
        { key: "name_mr", label: "नाव (MR)" },
        { key: "role", label: "Role" },
      ]}
    />
  );
}
