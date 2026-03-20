"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Users, FileDown, RefreshCw, Inbox, Heart, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

type Inquiry = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service_needed: string;
  message: string | null;
  status: string;
  created_at: string;
};

const statuses = ["new", "contacted", "in_progress", "closed"];

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<unknown>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/admin?table=inquiries");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setInquiries(data);
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
      setUser(user);
      fetchData();
    };
    checkAuth();
  }, [router, fetchData]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, table: "inquiries", status }),
    });
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  const exportCSV = () => {
    window.open("/api/admin?table=inquiries&format=csv", "_blank");
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const thisMonth = inquiries.filter((i) => {
    const d = new Date(i.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-dark">Admin Dashboard</h1>
          <p className="text-sm text-neutral-mid">H&amp;B Home Health — Manage inquiries, referrals &amp; applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/referrals"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light"
          >
            <Heart size={16} className="mr-1.5 inline" />
            Referrals
          </Link>
          <Link
            href="/admin/applications"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-dark hover:bg-neutral-light"
          >
            <Briefcase size={16} className="mr-1.5 inline" />
            Applications
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-mid hover:text-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl bg-pink-50 p-6">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-[#E8476C]" />
            <div>
              <p className="text-2xl font-bold text-neutral-dark">{inquiries.length}</p>
              <p className="text-sm text-neutral-mid">Total Inquiries</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-orange-50 p-6">
          <div className="flex items-center gap-3">
            <Inbox size={24} className="text-orange-500" />
            <div>
              <p className="text-2xl font-bold text-neutral-dark">{newInquiries}</p>
              <p className="text-sm text-neutral-mid">New / Unread</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-blue-50 p-6">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-neutral-dark">{thisMonth}</p>
              <p className="text-sm text-neutral-mid">This Month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-neutral-dark">Inquiries</h2>
        <div className="flex gap-2">
          <button onClick={fetchData} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-neutral-mid hover:text-neutral-dark">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8476C] px-3 py-1.5 text-sm text-white">
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-light">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Name</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Email</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Service</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Message</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Date</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-mid">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-neutral-light/50">
                <td className="px-4 py-3 font-medium text-neutral-dark whitespace-nowrap">
                  {inquiry.first_name} {inquiry.last_name}
                </td>
                <td className="px-4 py-3 text-neutral-mid">{inquiry.email}</td>
                <td className="px-4 py-3 text-neutral-mid whitespace-nowrap">{inquiry.phone}</td>
                <td className="px-4 py-3 text-neutral-mid">{inquiry.service_needed}</td>
                <td className="px-4 py-3 text-neutral-mid">
                  <span className="max-w-[200px] truncate block">{inquiry.message || "N/A"}</span>
                </td>
                <td className="px-4 py-3 text-neutral-mid whitespace-nowrap">
                  {new Date(inquiry.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={inquiry.status}
                    onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium border-0",
                      inquiry.status === "new" && "bg-blue-100 text-blue-700",
                      inquiry.status === "contacted" && "bg-yellow-100 text-yellow-700",
                      inquiry.status === "in_progress" && "bg-green-100 text-green-700",
                      inquiry.status === "closed" && "bg-gray-100 text-gray-700"
                    )}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-neutral-mid">
                  No inquiries yet. They&apos;ll appear here when someone submits a form.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
