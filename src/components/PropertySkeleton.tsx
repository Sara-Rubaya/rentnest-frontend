export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-ink/10 bg-white">
      <div className="aspect-[4/3] w-full animate-pulse bg-ink/10" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-ink/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink/10" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-ink/10" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
