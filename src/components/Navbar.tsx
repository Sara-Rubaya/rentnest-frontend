"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const dashboardHref = user ? `/dashboard/${user.role.toLowerCase()}` : "/auth/login";

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl italic tracking-tight text-ink focus-ring">
          RentNest
        </Link>

        {/* Desktop nav */}
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

        {/* Mobile hamburger toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-sm text-ink focus-ring md:hidden"
        >
          {open ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 bg-sand px-6 py-4 text-sm font-medium text-ink/80 md:hidden">
          <Link
            href="/properties"
            className={`rounded-sm px-3 py-2.5 ${pathname?.startsWith("/properties") ? "bg-teal-light text-teal-dark" : "hover:bg-ink/5"}`}
          >
            Browse
          </Link>
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className={`rounded-sm px-3 py-2.5 ${pathname?.startsWith("/dashboard") ? "bg-teal-light text-teal-dark" : "hover:bg-ink/5"}`}
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="mt-2 rounded-sm bg-ink px-3 py-2.5 text-left text-white hover:bg-ink/90"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-sm px-3 py-2.5 hover:bg-ink/5">
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="mt-2 rounded-sm bg-teal px-3 py-2.5 text-center text-white hover:bg-teal-dark"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}