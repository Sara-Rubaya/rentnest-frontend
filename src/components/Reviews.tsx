const REVIEWS = [
  {
    name: "Nusrat T.",
    role: "Tenant · Dhanmondi",
    quote:
      "Found a place within a week. The request-to-approval flow was so much clearer than messaging random Facebook groups.",
    rating: 5,
  },
  {
    name: "Rafiq H.",
    role: "Landlord · Gulshan",
    quote:
      "I can see every request and approve it in a click. Payments land automatically once a tenant checks out — no chasing anyone down.",
    rating: 5,
  },
  {
    name: "Ayesha K.",
    role: "Tenant · Bashundhara",
    quote:
      "Loved that I could filter by price and location right away. Checkout with Stripe felt genuinely secure.",
    rating: 4,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-dark">Reviews</p>
        <h2 className="mt-3 font-display text-3xl italic text-ink">What people are saying</h2>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {REVIEWS.map((r) => (
          <div key={r.name} className="flex flex-col rounded-sm border border-ink/10 bg-white p-6">
            <div className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={i < r.rating ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M12 2.5l2.9 6.1 6.6.7-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.7L12 2.5Z"
                    strokeLinejoin="round"
                  />
                </svg>
              ))}
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">&ldquo;{r.quote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3 border-t border-ink/10 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-light text-xs font-semibold text-teal-dark">
                {initials(r.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{r.name}</p>
                <p className="text-xs text-ink/50">{r.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}