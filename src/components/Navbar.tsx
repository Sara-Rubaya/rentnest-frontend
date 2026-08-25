"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const dashboardHref = user ? `/dashboard/${user.role.toLowerCase()}` : "/auth/login";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl italic tracking-tight text-ink focus-ring">
          RentNest
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/80 md:flex">
          <Link href="/properties" className={pathname?.startsWith("/properties") ? "text-teal" : "hover:text-teal"}>
            Browse
          </Link>
          {user ? (
            <>
              <Link href={dashboardHref} className={pathname?.startsWith("/dashboard") ? "text-teal" : "hover:text-teal"}>
                Dashboard
              </Link>
              <button onClick={logout} className="rounded-sm bg-ink px-4 py-2 text-white focus-ring hover:bg-ink/90">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:text-teal">
                Log in
              </Link>
              <Link href="/auth/register" className="rounded-sm bg-teal px-4 py-2 text-white focus-ring hover:bg-teal-dark">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
