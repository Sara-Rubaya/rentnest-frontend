const STATS = [
  { value: "500+", label: "Properties listed" },
  { value: "1,200+", label: "Happy tenants" },
  { value: "300+", label: "Landlord partners" },
  { value: "15+", label: "Cities covered" },
];

export default function Achievements() {
  return (
    <section className="border-y border-ink/10 bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`text-center px-2 ${i > 0 ? "sm:border-l sm:border-ink/15" : ""}`}
            >
              <p className="font-display text-4xl italic text-gold sm:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-sand/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}