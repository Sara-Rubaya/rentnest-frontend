"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { RentalRequest } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import ReviewForm from "./ReviewForm";

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<RentalRequest[]>("/rentals")
      .then((data) => {
        if (!cancelled) setRequests(data);
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

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">Welcome back{user ? `, ${user.name}` : ""}</h1>
      <p className="mt-2 text-sm text-ink/60">Track your rental requests, payments, and reviews.</p>

      {loading && <p className="mt-8 text-sm text-ink/50">Loading your requests…</p>}
      {errorMsg && <p className="mt-8 text-sm text-clay">{errorMsg}</p>}

      {!loading && !errorMsg && requests.length === 0 && (
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
          You haven't requested any properties yet.{" "}
          <Link href="/properties" className="font-medium text-teal-dark hover:underline">
            Browse listings →
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="rounded-sm border border-ink/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-ink">{req.property?.title || "Property"}</p>
                <p className="text-sm text-ink/60">{req.property?.location}</p>
                {req.property && (
                  <p className="mt-1 text-sm font-medium text-teal-dark">
                    ৳{req.property.price.toLocaleString()} / month
                  </p>
                )}
              </div>
              <StatusBadge status={req.status} />
            </div>

            {req.status === "APPROVED" && !req.payment && (
              <Link
                href={`/dashboard/tenant/requests/${req.id}/pay`}
                className="mt-4 inline-block rounded-sm bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark"
              >
                Proceed to payment
              </Link>
            )}

            {req.payment && (
              <p className="mt-3 text-xs uppercase tracking-wide text-ink/50">
                Payment: {req.payment.status} {req.payment.paidAt ? `· ${new Date(req.payment.paidAt).toLocaleDateString()}` : ""}
              </p>
            )}

            {req.status === "ACTIVE" && !req.review && <ReviewForm rentalRequestId={req.id} />}

            {req.review && (
              <p className="mt-3 text-sm text-ink/60">You rated this stay {"★".repeat(req.review.rating)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
