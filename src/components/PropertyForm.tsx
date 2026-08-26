"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { Property } from "@/types";

const PROPERTY_TYPES = ["Apartment", "House", "Studio", "Room"];

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
  initial?: Property;
}

export default function PropertyForm({ mode, propertyId, initial }: PropertyFormProps) {
  const router = useRouter();
  const { show } = useToast();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [type, setType] = useState(initial?.type ?? PROPERTY_TYPES[0]);
  const [amenities, setAmenities] = useState(initial?.amenities?.join(", ") ?? "");
  const [images, setImages] = useState(initial?.images?.join(", ") ?? "");
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const body = {
      title,
      description,
      location,
      price: Number(price),
      type,
      isAvailable,
      amenities: amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      images: images
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
    };
    try {
      if (mode === "create") {
        await api("/landlord/properties", { method: "POST", body });
        show("Listing created");
      } else {
        await api(`/landlord/properties/${propertyId}`, { method: "PUT", body });
        show("Listing updated");
      }
      router.push("/dashboard/landlord");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Cozy 2-bed apartment in Dhanmondi"
          className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Description
        </label>
        <textarea
          required
          minLength={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-sm border border-ink/15 p-3 text-sm focus-ring"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Location
          </label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Monthly price (৳)
        </label>
        <input
          required
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Amenities (comma separated)
        </label>
        <input
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          placeholder="Wifi, Parking, Balcony"
          className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Image URLs (comma separated)
        </label>
        <input
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
          className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
        />
        <p className="mt-1 text-xs text-ink/50">
          Paste hosted image links for now — direct file upload can be added once you wire up storage.
        </p>
      </div>

      {mode === "edit" && (
        <label className="flex items-center gap-2.5 text-sm text-ink/80">
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
            className="h-4 w-4 rounded border-ink/30 text-teal focus-ring"
          />
          Available for rent
        </label>
      )}

      {error && <p className="text-sm text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-sm bg-teal px-5 py-3 font-medium text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {submitting
          ? mode === "create"
            ? "Creating…"
            : "Saving…"
          : mode === "create"
          ? "Create listing"
          : "Save changes"}
      </button>
    </form>
  );
}