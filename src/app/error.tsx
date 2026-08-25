"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <p className="font-display text-3xl italic text-ink">Something didn't load</p>
      <p className="mt-3 text-sm text-ink/60">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-white focus-ring hover:bg-ink-dark"
      >
        Try again
      </button>
    </div>
  );
}
