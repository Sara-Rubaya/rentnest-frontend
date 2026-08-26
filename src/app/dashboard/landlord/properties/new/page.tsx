import PropertyForm from "@/components/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl italic text-ink">List a new property</h1>
      <p className="mt-2 text-sm text-ink/60">Fill in the details tenants will see on the listing page.</p>
      <PropertyForm mode="create" />
    </div>
  );
}