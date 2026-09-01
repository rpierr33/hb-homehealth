import Link from "next/link";
import { CreditCard, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { paymentMethodCaptures } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const metadata = {
  title: "Saved Cards · Admin",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  succeeded: "bg-green-100 text-green-800",
  setup_created: "bg-blue-100 text-blue-800",
  requires_payment_method: "bg-amber-100 text-amber-800",
  requires_confirmation: "bg-amber-100 text-amber-800",
  requires_action: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  canceled: "bg-red-100 text-red-800",
};

function shortId(value: string | null) {
  if (!value) return "-";
  if (value.length <= 14) return value;
  return `${value.slice(0, 10)}...${value.slice(-4)}`;
}

export default async function AdminPaymentsPage() {
  const rows = await db
    .select()
    .from(paymentMethodCaptures)
    .orderBy(desc(paymentMethodCaptures.createdAt))
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[#E8476C]">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-neutral-dark">
            Saved Cards
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            Stripe card validations and saved payment method references.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm font-medium text-neutral-mid hover:text-neutral-dark"
        >
          <ArrowLeft size={14} />
          Admin home
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <CreditCard size={32} className="mx-auto text-neutral-mid" />
          <p className="mt-3 text-sm font-medium text-neutral-dark">
            No saved card records yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-neutral-mid">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Card</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Stripe IDs</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="align-top hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-neutral-dark">
                      {row.customerName}
                    </p>
                    <p className="text-xs text-neutral-mid">
                      {row.customerEmail}
                    </p>
                    {row.customerPhone && (
                      <p className="text-xs text-neutral-mid">
                        {row.customerPhone}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {row.cardLast4 ? (
                      <>
                        <p className="font-medium text-neutral-dark">
                          {(row.cardBrand || "card").toUpperCase()} ending {row.cardLast4}
                        </p>
                        <p className="text-xs text-neutral-mid">
                          Expires {row.cardExpMonth}/{row.cardExpYear}
                        </p>
                      </>
                    ) : (
                      <p className="text-neutral-mid">Not completed</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[row.status ?? "setup_created"] ??
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {row.status}
                    </span>
                    {row.errorMessage && (
                      <p className="mt-1 max-w-xs text-xs text-red-600">
                        {row.errorMessage}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-mid">
                    <p>customer: {shortId(row.stripeCustomerId)}</p>
                    <p>setup: {shortId(row.stripeSetupIntentId)}</p>
                    <p>payment: {shortId(row.stripePaymentMethodId)}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-mid">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-neutral-mid">
        Full card numbers and CVC codes are never stored here. They stay inside
        Stripe.
      </p>
    </div>
  );
}
