"use client";

import { useState } from "react";

export interface Filters {
  location: string;
  type: string;
  minPrice: string;
  maxPrice: string;
}

const PROPERTY_TYPES = ["Any type", "Apartment", "House", "Studio", "Room"];

export default function FilterBar({ onChange }: { onChange: (filters: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({
    location: "",
    type: "Any type",
    minPrice: "",
    maxPrice: "",
  });

  function update(next: Partial<Filters>) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    onChange(merged);
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-sm border border-ink/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Location
        </label>
        <input
          value={filters.location}
          onChange={(e) => update({ location: e.target.value })}
          placeholder="Dhanmondi, Gulshan..."
          className="w-full rounded-sm border border-ink/15 px-3 py-2 text-sm focus-ring"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => update({ type: e.target.value })}
          className="w-full rounded-sm border border-ink/15 px-3 py-2 text-sm focus-ring"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Min price (৳)
        </label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => update({ minPrice: e.target.value })}
          placeholder="0"
          className="w-full rounded-sm border border-ink/15 px-3 py-2 text-sm focus-ring"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
          Max price (৳)
        </label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => update({ maxPrice: e.target.value })}
          placeholder="No limit"
          className="w-full rounded-sm border border-ink/15 px-3 py-2 text-sm focus-ring"
        />
      </div>
    </div>
  );
}
