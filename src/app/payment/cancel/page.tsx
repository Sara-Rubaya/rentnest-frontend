import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/10 text-3xl text-clay">
        ✕
      </div>
      <p className="mt-6 font-display text-3xl italic text-ink">Payment cancelled</p>
      <p className="mt-2 text-sm text-ink/60">No charge was made. You can try again anytime from your dashboard.</p>
      <Link
        href="/dashboard/tenant"
        className="mt-8 rounded-sm bg-teal px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-dark"
      >
        Back to my dashboard
      </Link>
    </div>
  );
}
