"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, FileDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Referral = {
  id: string;
  referrer_name: string;
  referrer_phone: string;
  referrer_email: string;
  patient_name: string;
  patient_phone: string;
  service_needed: string;
  notes: string | null;
  status: string;
  created_at: string;
};

const statuses = ["new", "contacted", "in_progress", "closed"];

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin?table=referrals");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setReferrals(data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }
      fetchData();
    };
    checkAuth();
  }, [router, fetchData]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, table: "referrals", status }),
    });
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const exportCSV = () => {
    window.open("/api/admin?table=referrals&format=csv", "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-[#E8476C]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-[#E8476C] hover:text-[#c73a5a] mb-2">
            <ArrowLeft size={14} /> Back to Inquiries
          </Link>
          <h1 className="font-display text-3xl font-bold text-neutral-dark">Referrals</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchData} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-neutral-mid hover:text-neutral-dark">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8476C] px-3 py-1.5 text-sm text-white">
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-light">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Referrer</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Referrer Contact</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Patient</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Patient Phone</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Service</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Notes</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Submitted</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {referrals.map((ref) => (
              <tr key={ref.id} className="hover:bg-neutral-light/50">
                <td className="px-4 py-3 font-medium text-neutral-dark whitespace-nowrap">
                  {ref.referrer_name}
                </td>
                <td className="px-4 py-3 text-neutral-mid">
                  <div>{ref.referrer_email}</div>
                  <div className="text-xs">{ref.referrer_phone}</div>
                </td>
                <td className="px-4 py-3 font-medium text-neutral-dark whitespace-nowrap">
                  {ref.patient_name}
                </td>
                <td className="px-4 py-3 text-neutral-mid whitespace-nowrap">{ref.patient_phone}</td>
                <td className="px-4 py-3 text-neutral-mid">{ref.service_needed}</td>
                <td className="px-4 py-3 text-neutral-mid">
                  <span className="max-w-[180px] truncate block">{ref.notes || "N/A"}</span>
                </td>
                <td className="px-4 py-3 text-neutral-mid whitespace-nowrap">
                  {new Date(ref.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={ref.status}
                    onChange={(e) => updateStatus(ref.id, e.target.value)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium border-0",
                      ref.status === "new" && "bg-blue-100 text-blue-700",
                      ref.status === "contacted" && "bg-yellow-100 text-yellow-700",
                      ref.status === "in_progress" && "bg-green-100 text-green-700",
                      ref.status === "closed" && "bg-gray-100 text-gray-700"
                    )}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {referrals.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-neutral-mid">
                  No referrals yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
