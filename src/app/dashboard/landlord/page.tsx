"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { Property, RentalRequest } from "@/types";
import LandlordPropertyCard from "@/components/LandlordPropertyCard";
import { PropertyGridSkeleton } from "@/components/PropertySkeleton";

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api<Property[]>("/landlord/properties"), api<RentalRequest[]>("/landlord/requests")])
      .then(([props, reqs]) => {
        if (!cancelled) {
          setProperties(props);
          setRequests(reqs);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorMsg(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeRequests = requests.filter((r) => r.status === "PENDING" || r.status === "APPROVED").length;
  const earnings = requests
    .filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED")
    .reduce((sum, r) => sum + (r.property?.price || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl italic text-ink">
            {user ? `${user.name}'s properties` : "Your properties"}
          </h1>
          <p className="mt-2 text-sm text-ink/60">Manage your listings and incoming requests.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/landlord/requests"
            className="rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-sm font-medium text-ink hover:border-ink/30"
          >
            View requests
          </Link>
          <Link
            href="/dashboard/landlord/properties/new"
            className="rounded-sm bg-teal px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-dark"
          >
            + New listing
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-ink/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50">Total properties</p>
          <p className="mt-1 font-display text-3xl italic text-ink">{properties.length}</p>
        </div>
        <div className="rounded-sm border border-ink/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50">Active requests</p>
          <p className="mt-1 font-display text-3xl italic text-ink">{activeRequests}</p>
        </div>
        <div className="rounded-sm border border-ink/10 bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink/50">Earnings to date</p>
          <p className="mt-1 font-display text-3xl italic text-teal-dark">৳{earnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl italic text-ink">Your listings</h2>
        <div className="mt-5">
          {loading && <PropertyGridSkeleton />}
          {errorMsg && <p className="text-sm text-clay">{errorMsg}</p>}
          {!loading && !errorMsg && properties.length === 0 && (
            <div className="rounded-sm border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
              You haven't listed a property yet.{" "}
              <Link href="/dashboard/landlord/properties/new" className="font-medium text-teal-dark hover:underline">
                Create your first listing →
              </Link>
            </div>
          )}
          {!loading && !errorMsg && properties.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <LandlordPropertyCard
                  key={p.id}
                  property={p}
                  onDeleted={(id) => setProperties((prev) => prev.filter((prop) => prop.id !== id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}