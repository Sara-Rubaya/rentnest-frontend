import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types";

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.images?.[0] || "/placeholder-property.svg";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block overflow-hidden rounded-sm border border-ink/10 bg-white transition hover:-translate-y-0.5 hover:shadow-md focus-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-light">
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
      <div className="p-4">
        <p className="font-display text-lg text-ink">{property.title}</p>
        <p className="mt-1 text-sm text-ink/60">{property.location}</p>
        <div className="mt-3 flex items-center justify-between">
          <p className="font-semibold text-ink-dark">
            ৳{property.price.toLocaleString()} <span className="font-normal text-ink/50">/ month</span>
          </p>
          <span className="text-xs uppercase tracking-wide text-ink/50">{property.type}</span>
        </div>
      </div>
    </Link>
  );
}
