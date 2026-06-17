import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { getVolunteers, deleteVolunteer } from "@/lib/firebase-utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_layout/volunteers")({
  component: VolunteersPage,
});

function VolunteersPage() {
  const [items, setItems] = useState<CrudItem[]>([]);

  useEffect(() => {
    const unsubscribe = getVolunteers((data) => {
      setItems(data as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteVolunteer(id);
  };

  return (
    <CrudManager<CrudItem>
      title="Volunteers"
      description="List of individuals who have signed up to volunteer."
      initial={items}
      onDelete={handleDelete}
      hideNewEntry={true}
      fields={[
        { key: "name", label: "Volunteer Name" },
        { key: "skill", label: "Skills/Interest" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
      ]}
      columns={[
        { key: "name", label: "Volunteer" },
        { key: "skill", label: "Skills/Interest" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
      ]}
    />
  );
}
