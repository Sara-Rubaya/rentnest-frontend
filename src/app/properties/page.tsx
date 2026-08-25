"use client";

import { useEffect, useState } from "react";
import { apiWithMeta } from "@/lib/api";
import type { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import { PropertyGridSkeleton } from "@/components/PropertySkeleton";
import FilterBar, { Filters } from "@/components/FilterBar";

const EMPTY_FILTERS: Filters = { location: "", type: "Any type", minPrice: "", maxPrice: "" };

function buildQuery(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.location) params.set("location", filters.location);
  if (filters.type !== "Any type") params.set("type", filters.type);
  if (filters.minPrice) params.set("minPrice", filters.minPrice);
  if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
  params.set("limit", "24");
  return params.toString();
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);
    // The backend filters server-side (see property.service.ts getAll), so we just pass
    // the query string straight through instead of filtering client-side.
    apiWithMeta<Property[]>(`/properties?${buildQuery(filters)}`, { auth: false })
      .then(({ data, meta }) => {
        if (!cancelled) {
          setProperties(data);
          setTotal(meta?.total ?? data.length);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorMsg(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">Browse properties</h1>
      <p className="mt-2 text-sm text-ink/60">
        {loading ? "Loading listings…" : `${total} propert${total === 1 ? "y" : "ies"} found`}
      </p>

      <div className="mt-6">
        <FilterBar onChange={setFilters} />
      </div>

      <div className="mt-8">
        {loading && <PropertyGridSkeleton />}

        {!loading && errorMsg && (
          <div className="rounded-sm border border-clay/30 bg-clay/5 p-6 text-sm text-clay">
            Couldn't load properties: {errorMsg}. Check that NEXT_PUBLIC_API_BASE_URL points to your backend.
          </div>
        )}

        {!loading && !errorMsg && properties.length === 0 && (
          <div className="rounded-sm border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
            No properties match those filters yet.
          </div>
        )}

        {!loading && !errorMsg && properties.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
