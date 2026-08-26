"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { Property } from "@/types";

export default function LandlordPropertyCard({
  property,
  onDeleted,
}: {
  property: Property;
  onDeleted: (id: string) => void;
}) {
  const { show } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const cover = property.images?.[0] || "/placeholder-property.svg";

  async function handleDelete() {
    setDeleting(true);
    try {
      await api(`/landlord/properties/${property.id}`, { method: "DELETE" });
      show("Listing deleted");
      onDeleted(property.id);
    } catch (err) {
      show(err instanceof Error ? err.message : "Couldn't delete listing", "error");
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border border-ink/10 bg-white">
      <Link href={`/properties/${property.id}`} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-teal-light">
          <Image
            src={cover}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {!property.isAvailable && (
            <span className="absolute left-3 top-3 rounded-sm bg-ink/80 px-2 py-1 text-xs font-semibold text-white">
              Not available
            </span>
          )}
        </div>
        <div className="p-4 pb-2">
          <p className="font-display text-lg text-ink">{property.title}</p>
          <p className="mt-1 text-sm text-ink/60">{property.location}</p>
          <p className="mt-3 font-semibold text-teal-dark">
            ৳{property.price.toLocaleString()} <span className="font-normal text-ink/50">/ month</span>
          </p>
        </div>
      </Link>

      <div className="flex gap-2 border-t border-ink/10 p-3">
        <Link
          href={`/dashboard/landlord/properties/${property.id}/edit`}
          className="flex-1 rounded-sm border border-ink/15 py-2 text-center text-sm font-medium text-ink hover:border-ink/30"
        >
          Edit
        </Link>
        {confirming ? (
          <div className="flex flex-1 gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-sm bg-clay py-2 text-sm font-medium text-white hover:bg-clay/90 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Confirm"}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="rounded-sm border border-ink/15 px-3 py-2 text-sm text-ink/60 hover:text-ink"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="flex-1 rounded-sm border border-clay/30 py-2 text-sm font-medium text-clay hover:bg-clay/5"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}