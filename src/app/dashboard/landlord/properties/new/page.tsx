"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

const PROPERTY_TYPES = ["Apartment", "House", "Studio", "Room"];

export default function NewPropertyPage() {
  const router = useRouter();
  const { show } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState(PROPERTY_TYPES[0]);
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api("/landlord/properties", {
        method: "POST",
        body: {
          title,
          description,
          location,
          price: Number(price),
          type,
          amenities: amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          images: images
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        },
      });
      show("Listing created");
      router.push("/dashboard/landlord");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create listing");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">List a new property</h1>
      <p className="mt-2 text-sm text-ink/60">Fill in the details tenants will see on the listing page.</p>

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

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-ink px-5 py-3 font-medium text-white hover:bg-ink-dark disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create listing"}
        </button>
      </form>
    </div>
  );
}
