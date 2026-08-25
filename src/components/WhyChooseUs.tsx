const FEATURES = [
  {
    title: "Verified listings",
    description: "Every property is tied to a real landlord account, so what you see is what you get.",
    icon: (
      <path
        d="M9 12l2 2 4-4m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Direct communication",
    description: "Request, negotiate, and get approved without a middleman slowing things down.",
    icon: (
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Secure payments",
    description: "Stripe Checkout handles every transaction — no cash, no awkward bank transfers.",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 10h20" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Built for every role",
    description: "Tenants, landlords, and admins each get a dashboard shaped around what they need to do.",
    icon: (
      <path
        d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 20v-2a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-dark">Why choose us</p>
        <h2 className="mt-3 font-display text-3xl italic text-ink">Renting, without the runaround</h2>
        <p className="mt-3 text-sm text-ink/60">
          RentNest cuts out the guesswork on both sides — clearer listings for tenants, less admin for landlords.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-sm border border-ink/10 bg-white p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-light text-teal-dark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                {f.icon}
              </svg>
            </div>
            <p className="mt-4 font-display text-lg italic text-ink">{f.title}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/60">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}