import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import type { Property } from "@/types";
import RequestToRentButton from "./RequestToRentButton";

async function getProperty(id: string): Promise<Property | null> {
  try {
    return await api<Property>(`/properties/${id}`, { auth: false });
  } catch {
    return null;
  }
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await getProperty(params.id);
  if (!property) notFound();

  const images = property.images?.length ? property.images : ["/placeholder-property.svg"];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-4 gap-2">
            <div className="relative col-span-4 aspect-[16/9] overflow-hidden rounded-sm bg-ink-light sm:col-span-3">
              <Image src={images[0]} alt={property.title} fill sizes="66vw" className="object-cover" />
            </div>
            <div className="hidden grid-rows-3 gap-2 sm:col-span-1 sm:grid">
              {images.slice(1, 4).map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-ink-light">
                  <Image src={img} alt={`${property.title} ${i + 2}`} fill sizes="16vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl italic text-ink">{property.title}</h1>
              <p className="mt-1 text-ink/60">{property.location}</p>
            </div>
            {property.category && (
              <span className="whitespace-nowrap rounded-sm bg-ink/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink/60">
                {property.category.name}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {property.amenities?.map((a) => (
              <span key={a} className="rounded-sm bg-ink-light px-3 py-1 text-xs font-medium text-ink-dark">
                {a}
              </span>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-ink/80">{property.description}</p>

          {property.landlord && (
            <div className="mt-8 rounded-sm border border-ink/10 bg-white p-4">
              <p className="text-xs uppercase tracking-wide text-ink/50">Listed by</p>
              <p className="font-medium text-ink">{property.landlord.name}</p>
              <p className="text-sm text-ink/60">{property.landlord.email}</p>
            </div>
          )}

          {property.reviews && property.reviews.length > 0 && (
            <div className="mt-8">
              <p className="font-display text-xl italic text-ink">Reviews</p>
              <div className="mt-3 space-y-3">
                {property.reviews.map((r) => (
                  <div key={r.id} className="rounded-sm border border-ink/10 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-ink">{r.tenant?.name || "Tenant"}</p>
                      <p className="text-sm text-gold">{"★".repeat(r.rating)}</p>
                    </div>
                    {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-sm border border-ink/10 bg-white p-6 lg:sticky lg:top-24">
          <p className="font-display text-3xl italic text-ink-dark">
            ৳{property.price.toLocaleString()}
            <span className="ml-1 text-base font-normal text-ink/50">/ month</span>
          </p>
          <p className="mt-1 text-sm text-ink/60">
            {property.isAvailable ? "Available now" : "Currently unavailable"}
          </p>

          <div className="mt-6">
            <RequestToRentButton propertyId={property.id} available={property.isAvailable} />
          </div>
        </aside>
      </div>
    </div>
  );
}
