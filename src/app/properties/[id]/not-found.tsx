import Link from "next/link";

export default function PropertyNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <p className="font-display text-3xl italic text-ink">Listing not found</p>
      <p className="mt-3 text-sm text-ink/60">
        This property may have been removed or the link is out of date.
      </p>
      <Link
        href="/properties"
        className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-white focus-ring hover:bg-ink-dark"
      >
        Back to listings
      </Link>
    </div>
  );
}
