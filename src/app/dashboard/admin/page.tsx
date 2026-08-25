"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import type { Property, RentalRequest, User, UserStatus } from "@/types";
import StatusBadge from "@/components/StatusBadge";

type Tab = "users" | "properties" | "rentals";

export default function AdminDashboardPage() {
  const { show } = useToast();
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<User[]>("/admin/users"),
      api<Property[]>("/admin/properties"),
      api<RentalRequest[]>("/admin/rentals"),
    ])
      .then(([u, p, r]) => {
        if (!cancelled) {
          setUsers(u);
          setProperties(p);
          setRentals(r);
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

  async function toggleBan(user: User) {
    const nextStatus: UserStatus = user.status === "BANNED" ? "ACTIVE" : "BANNED";
    const previous = users;
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)));
    setActingId(user.id);
    try {
      await api(`/admin/users/${user.id}`, { method: "PATCH", body: { status: nextStatus } });
      show(nextStatus === "BANNED" ? `${user.name} banned` : `${user.name} unbanned`);
    } catch (err) {
      setUsers(previous);
      show(err instanceof Error ? err.message : "Couldn't update user", "error");
    } finally {
      setActingId(null);
    }
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "users", label: "Users", count: users.length },
    { key: "properties", label: "Properties", count: properties.length },
    { key: "rentals", label: "Rental requests", count: rentals.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">Platform overview</h1>
      <p className="mt-2 text-sm text-ink/60">Monitor users, listings, and rental activity across RentNest.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-sm border p-5 text-left focus-ring ${
              tab === t.key ? "border-teal bg-teal-light" : "border-ink/10 bg-white hover:border-ink/25"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-ink/50">{t.label}</p>
            <p className="mt-1 font-display text-3xl italic text-ink">{t.count}</p>
          </button>
        ))}
      </div>

      {loading && <p className="mt-8 text-sm text-ink/50">Loading platform data…</p>}
      {errorMsg && <p className="mt-8 text-sm text-clay">{errorMsg}</p>}

      {!loading && !errorMsg && tab === "users" && (
        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/5 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink/70">{u.email}</td>
                  <td className="px-4 py-3 text-ink/70">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-sm px-2.5 py-1 text-xs font-semibold uppercase ${
                        u.status === "BANNED" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== "ADMIN" && (
                      <button
                        disabled={actingId === u.id}
                        onClick={() => toggleBan(u)}
                        className={`rounded-sm px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${
                          u.status === "BANNED"
                            ? "bg-teal text-white hover:bg-teal-dark"
                            : "border border-clay/30 text-clay hover:bg-clay/5"
                        }`}
                      >
                        {u.status === "BANNED" ? "Unban" : "Ban"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !errorMsg && tab === "properties" && (
        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/5 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Landlord</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Available</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{p.title}</td>
                  <td className="px-4 py-3 text-ink/70">{p.location}</td>
                  <td className="px-4 py-3 text-ink/70">{p.landlord?.name}</td>
                  <td className="px-4 py-3 text-ink/70">৳{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink/70">{p.isAvailable ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !errorMsg && tab === "rentals" && (
        <div className="mt-8 overflow-hidden rounded-sm border border-ink/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/10 bg-ink/5 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Requested</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((r) => (
                <tr key={r.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{r.property?.title}</td>
                  <td className="px-4 py-3 text-ink/70">{r.tenant?.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-ink/50">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
