import Link from "next/link";

const EXPLORE_LINKS = [
  { href: "/properties", label: "Browse properties" },
  { href: "/auth/register", label: "List your property" },
];

const ACCOUNT_LINKS = [
  { href: "/auth/login", label: "Log in" },
  { href: "/auth/register", label: "Create account" },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-sand/70">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-2xl italic text-sand">RentNest</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-sand/60">
              A calmer way to rent — browse verified listings, message landlords directly,
              and pay securely, all in one place.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sand/40">Explore</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sand/40">Account</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-sand/10 pt-6 text-xs text-sand/40 sm:flex-row">
          <p>© {new Date().getFullYear()} RentNest. All rights reserved.</p>
          <p>Built with Next.js &amp; Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}