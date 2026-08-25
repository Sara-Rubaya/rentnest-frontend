import type { RentalStatus } from "@/types";

const STYLES: Record<RentalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-gray-200 text-gray-700",
};

export default function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span className={`inline-block rounded-sm px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${STYLES[status]}`}>
      {status}
    </span>
  );
}
