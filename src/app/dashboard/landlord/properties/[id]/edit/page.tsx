"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Property } from "@/types";
import PropertyForm from "@/components/PropertyForm";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Property>(`/properties/${params.id}`, { auth: false })
      .then(setProperty)
      .catch((err) => setError(err.message));
  }, [params.id]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">Edit listing</h1>
      <p className="mt-2 text-sm text-ink/60">Update the details tenants will see on this listing.</p>

      {error && <p className="mt-6 text-sm text-clay">{error}</p>}
      {!error && !property && <p className="mt-6 text-sm text-ink/50">Loading listing…</p>}
      {property && <PropertyForm mode="edit" propertyId={property.id} initial={property} />}
    </div>
  );
}