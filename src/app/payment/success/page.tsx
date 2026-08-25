"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import type { Payment } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"verifying" | "done" | "error">("verifying");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("Missing checkout session.");
      return;
    }
    api<Payment>(`/payments/verify/${sessionId}`)
      .then((data) => {
        setPayment(data);
        setStatus("done");
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [sessionId]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      {status === "verifying" && <p className="text-ink/60">Confirming your payment…</p>}

      {status === "done" && (
        <>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-light text-3xl text-ink-dark">
            ✓
          </div>
          <p className="mt-6 font-display text-3xl italic text-ink">Payment successful</p>
          <p className="mt-2 text-sm text-ink/60">
            {payment ? `৳${payment.amount.toLocaleString()} paid.` : "Your payment has been recorded."} Your
            rental is now active.
          </p>
          <Link
            href="/dashboard/tenant"
            className="mt-8 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-dark"
          >
            Go to my dashboard
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="font-display text-2xl italic text-ink">Couldn't confirm payment</p>
          <p className="mt-2 text-sm text-clay">{error}</p>
          <Link
            href="/dashboard/tenant"
            className="mt-6 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink/90"
          >
            Back to dashboard
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-center text-ink/50">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
