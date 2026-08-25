import Link from "next/link";
import { api } from "@/lib/api";
import type { Property } from "@/types";
import PropertyCard from "@/components/PropertyCard";
import { PropertyGridSkeleton } from "@/components/PropertySkeleton";
import { Suspense } from "react";

async function FeaturedProperties() {
  let properties: Property[] = [];
  try {
    properties = await api<Property[]>("/properties", { auth: false });
  } catch {
    properties = [];
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
        No listings yet. Once your backend is connected, featured properties will show up here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.slice(0, 6).map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-ink/10 bg-teal-light">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-teal-dark">
              A calmer way to rent
            </p>
            <h1 className="font-display text-5xl italic leading-[1.05] text-ink sm:text-6xl">
              Find your next home,
              <br />
              without the noise.
            </h1>
            <p className="mt-6 max-w-md text-ink/70">
              Browse verified listings, message landlords directly, and pay securely —
              all in one place built for tenants and landlords alike.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/properties"
                className="rounded-sm bg-ink px-6 py-3 font-medium text-white focus-ring hover:bg-ink/90"
              >
                Browse properties
              </Link>
              <Link
                href="/auth/register"
                className="rounded-sm border border-ink/20 bg-white px-6 py-3 font-medium text-ink focus-ring hover:border-ink/40"
              >
                List your property
              </Link>
            </div>
          </div>
         <div className="relative overflow-hidden rounded-sm border border-ink/10 bg-white p-8">
  {/* Decorative accent shape, tucked in the corner */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-light" />
  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold/10" />

  <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
    Why RentNest
  </p>

  <div className="relative mt-6 divide-y divide-ink/10">
    <div className="flex items-center gap-4 py-5 first:pt-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal-dark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-2a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <p className="font-display text-2xl italic text-ink">Three roles, one platform</p>
        <p className="mt-0.5 text-sm text-ink/60">Tenant, landlord, and admin — each with their own dashboard</p>
      </div>
    </div>

    <div className="flex items-center gap-4 py-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal-dark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-display text-2xl italic text-ink">Secure checkout</p>
        <p className="mt-0.5 text-sm text-ink/60">Stripe-powered payment on every approved request</p>
      </div>
    </div>

    <div className="flex items-center gap-4 py-5 last:pb-0">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-light text-teal-dark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 12h4l3 8 4-16 3 8h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div>
        <p className="font-display text-2xl italic text-ink">Live status updates</p>
        <p className="mt-0.5 text-sm text-ink/60">Track every request from submission to move-in</p>
      </div>
    </div>
  </div>
</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl italic text-ink">Featured properties</h2>
          <Link href="/properties" className="text-sm font-medium text-teal-dark hover:underline">
            View all →
          </Link>
        </div>
        <Suspense fallback={<PropertyGridSkeleton />}>
          <FeaturedProperties />
        </Suspense>
      </section>
    </div>
  );
}
