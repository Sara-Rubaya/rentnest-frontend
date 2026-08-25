"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { RentalRequest } from "@/types";

export default function PayForRequestPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<RentalRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    api<RentalRequest>(`/rentals/${params.id}`)
      .then(setRequest)
      .catch((err) => setError(err.message));
  }, [params.id]);

  async function startCheckout() {
    setRedirecting(true);
    setError(null);
    try {
      const result = await api<{ checkoutUrl: string; sessionId: string }>("/payments/create", {
        method: "POST",
        body: { rentalRequestId: params.id },
      });
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start checkout");
      setRedirecting(false);
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="font-display text-2xl italic text-ink">Something went wrong</p>
        <p className="mt-2 text-sm text-clay">{error}</p>
        <button
          onClick={() => router.push("/dashboard/tenant")}
          className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (!request) {
    return <div className="mx-auto max-w-md px-6 py-16 text-center text-ink/50">Loading request…</div>;
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="font-display text-3xl italic text-ink">Confirm payment</h1>
      <div className="mt-6 rounded-sm border border-ink/10 bg-white p-5">
        <p className="font-medium text-ink">{request.property?.title}</p>
        <p className="text-sm text-ink/60">{request.property?.location}</p>
        <p className="mt-3 font-display text-2xl italic text-teal-dark">
          ৳{request.property?.price.toLocaleString()} <span className="text-sm font-normal text-ink/50">/ month</span>
        </p>
      </div>
      <p className="mt-4 text-sm text-ink/60">
        You'll be redirected to Stripe Checkout to complete this payment securely.
      </p>
      <button
        onClick={startCheckout}
        disabled={redirecting}
        className="mt-6 w-full rounded-sm bg-teal px-5 py-3 font-medium text-white hover:bg-teal-dark disabled:opacity-60"
      >
        {redirecting ? "Redirecting to Stripe…" : "Pay now"}
      </button>
    </div>
  );
}
