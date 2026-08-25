"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import type { Role } from "@/types";

const ROLES: { value: Role; label: string; blurb: string }[] = [
  { value: "TENANT", label: "Tenant", blurb: "Browse and request to rent" },
  { value: "LANDLORD", label: "Landlord", blurb: "List and manage properties" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("TENANT");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16">
      <h1 className="font-display text-3xl italic text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/60">Choose how you'll use RentNest — you can't change this later.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {ROLES.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`rounded-sm border p-4 text-left focus-ring ${
                role === r.value ? "border-ink bg-ink-light" : "border-ink/15 hover:border-ink/30"
              }`}
            >
              <p className="font-medium text-ink">{r.label}</p>
              <p className="mt-1 text-xs text-ink/60">{r.blurb}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">Full name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-ink/15 px-3 py-2.5 text-sm focus-ring"
          />
        </div>

        {error && <p className="text-sm text-clay">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-ink px-5 py-3 font-medium text-white focus-ring hover:bg-ink-dark disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-ink-dark hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
