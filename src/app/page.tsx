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
          <div className="relative aspect-square rounded-sm border border-ink/10 bg-white p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="font-display text-4xl italic text-teal-dark">3</p>
                <p className="text-sm text-ink/60">roles, one platform — tenant, landlord, admin</p>
              </div>
              <div>
                <p className="font-display text-4xl italic text-teal-dark">Secure</p>
                <p className="text-sm text-ink/60">checkout on every approved request</p>
              </div>
              <div>
                <p className="font-display text-4xl italic text-teal-dark">Live</p>
                <p className="text-sm text-ink/60">status updates from request to move-in</p>
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
