"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

export default function RequestToRentButton({
  propertyId,
  available,
}: {
  propertyId: string;
  available: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submitRequest() {
    if (!user) {
      router.push(`/auth/login?next=/properties/${propertyId}`);
      return;
    }
    setSubmitting(true);
    try {
      await api("/rentals", {
        method: "POST",
        body: {
          propertyId,
          message: message || undefined,
          moveInDate: moveInDate ? new Date(moveInDate).toISOString() : undefined,
        },
      });
      show("Request sent! Track its status from your dashboard.");
      setOpen(false);
      router.push("/dashboard/tenant");
    } catch (err) {
      show(err instanceof Error ? err.message : "Couldn't send request", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (!available) {
    return (
      <button disabled className="w-full cursor-not-allowed rounded-sm bg-ink/20 px-5 py-3 font-medium text-ink/50">
        Not available
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-sm bg-ink px-5 py-3 font-medium text-white focus-ring hover:bg-ink-dark"
      >
        Request to rent
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
          <div className="w-full max-w-md rounded-sm bg-white p-6">
            <p className="font-display text-xl italic text-ink">Send a request</p>
            <p className="mt-1 text-sm text-ink/60">A short note helps the landlord respond faster.</p>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                Preferred move-in date (optional)
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full rounded-sm border border-ink/15 p-2.5 text-sm focus-ring"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="e.g. I'd like to move in from next month, family of two…"
              className="mt-4 w-full rounded-sm border border-ink/15 p-3 text-sm focus-ring"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded-sm px-4 py-2 text-sm font-medium text-ink/60 hover:text-ink"
              >
                Cancel
              </button>
              <button
                onClick={submitRequest}
                disabled={submitting}
                className="rounded-sm bg-ink px-5 py-2 text-sm font-medium text-white focus-ring hover:bg-ink-dark disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
