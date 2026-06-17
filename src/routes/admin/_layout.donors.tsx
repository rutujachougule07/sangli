import { createFileRoute } from "@tanstack/react-router";
import { CrudManager, type CrudItem } from "@/components/admin/CrudManager";
import { getDonations, deleteDonation } from "@/lib/firebase-utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin/_layout/donors")({
  component: DonorsPage,
});

function DonorsPage() {
  const [items, setItems] = useState<CrudItem[]>([]);

  useEffect(() => {
    const unsubscribe = getDonations((data) => {
      setItems(data as unknown as CrudItem[]);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteDonation(id);
  };

  return (
    <CrudManager<CrudItem>
      title="Donations"
      description="List of individuals who have expressed intent to donate."
      initial={items}
      onDelete={handleDelete}
      hideNewEntry={true}
      fields={[
        { key: "name", label: "Donor Name" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "aadhaar", label: "Aadhaar" },
        { key: "pan", label: "PAN" },
      ]}
      columns={[
        { key: "name", label: "Donor" },
        { key: "amount", label: "Amount (₹)" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "aadhaar", label: "Aadhaar" },
        { key: "pan", label: "PAN" },
      ]}
    />
  );
}
