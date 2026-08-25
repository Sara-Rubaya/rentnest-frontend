"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { RentalRequest, RentalStatus } from "@/types";
import StatusBadge from "@/components/StatusBadge";

export default function LandlordRequestsPage() {
  const { show } = useToast();
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    api<RentalRequest[]>("/landlord/requests")
      .then(setRequests)
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: string, status: Extract<RentalStatus, "APPROVED" | "REJECTED">) {
    const previous = requests;
    // Optimistic update so the table reflects the change instantly.
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setActingId(id);
    try {
      await api(`/landlord/requests/${id}`, { method: "PATCH", body: { status } });
      show(`Request ${status === "APPROVED" ? "approved" : "rejected"}`);
    } catch (err) {
      setRequests(previous);
      show(err instanceof Error ? err.message : "Couldn't update request", "error");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">Rental requests</h1>
      <p className="mt-2 text-sm text-ink/60">Approve or reject incoming requests for your properties.</p>

      {loading && <p className="mt-8 text-sm text-ink/50">Loading requests…</p>}
      {errorMsg && <p className="mt-8 text-sm text-clay">{errorMsg}</p>}

      {!loading && !errorMsg && requests.length === 0 && (
        <div className="mt-8 rounded-sm border border-dashed border-ink/20 bg-white p-10 text-center text-ink/60">
          No requests yet.
        </div>
      )}

      {!loading && !errorMsg && requests.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/5 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{r.property?.title}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {r.tenant?.name}
                    <div className="text-xs text-ink/40">{r.tenant?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-ink/50">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "PENDING" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={actingId === r.id}
                          onClick={() => updateStatus(r.id, "APPROVED")}
                          className="rounded-sm bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-dark disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          disabled={actingId === r.id}
                          onClick={() => updateStatus(r.id, "REJECTED")}
                          className="rounded-sm border border-clay/30 px-3 py-1.5 text-xs font-medium text-clay hover:bg-clay/5 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
