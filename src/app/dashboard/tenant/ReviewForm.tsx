"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";

export default function ReviewForm({ rentalRequestId }: { rentalRequestId: string }) {
  const { show } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      await api("/reviews", { method: "POST", body: { rentalRequestId, rating, comment: comment || undefined } });
      show("Thanks for your review!");
      setSubmitted(true);
      setOpen(false);
    } catch (err) {
      show(err instanceof Error ? err.message : "Couldn't submit review", "error");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <p className="mt-3 text-sm text-teal-dark">Review submitted — thank you!</p>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 rounded-sm border border-teal px-4 py-2 text-sm font-medium text-teal-dark hover:bg-teal-light"
      >
        Leave a review
      </button>
    );
  }

  return (
    <div className="mt-4 rounded-sm border border-ink/10 bg-sand p-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            className={`text-2xl ${n <= rating ? "text-gold" : "text-ink/20"}`}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="How was your stay?"
        className="mt-3 w-full rounded-sm border border-ink/15 p-2.5 text-sm focus-ring"
      />
      <div className="mt-3 flex justify-end gap-3">
        <button onClick={() => setOpen(false)} className="text-sm text-ink/60 hover:text-ink">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={submitting}
          className="rounded-sm bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-dark disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
      </div>
    </div>
  );
}
