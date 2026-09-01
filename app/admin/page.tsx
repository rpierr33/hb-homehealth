"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users, FileDown, RefreshCw, Inbox, Heart, Briefcase, Megaphone,
  X, Trash2, ChevronDown, ClipboardList, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TabKey = "leads" | "inquiries" | "referrals" | "applications";

const TABS: { key: TabKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: "leads", label: "Leads", icon: Megaphone, color: "text-violet-600" },
  { key: "inquiries", label: "Inquiries", icon: Inbox, color: "text-blue-600" },
  { key: "referrals", label: "Referrals", icon: Heart, color: "text-pink-600" },
  { key: "applications", label: "Applications", icon: Briefcase, color: "text-green-600" },
];

const STATUS_OPTIONS: Record<TabKey, string[]> = {
  leads: ["new", "contacted", "qualified", "closed"],
  inquiries: ["new", "contacted", "in_progress", "closed"],
  referrals: ["new", "contacted", "in_progress", "closed"],
  applications: ["new", "reviewed", "interview", "hired", "rejected"],
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-purple-100 text-purple-700",
  in_progress: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  reviewed: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  hired: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function formatLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Field display config per tab — determines which columns show in table
const TABLE_COLUMNS: Record<TabKey, { key: string; label: string }[]> = {
  leads: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "serviceNeeded", label: "Service" },
    { key: "createdAt", label: "Date" },
    { key: "status", label: "Status" },
  ],
  inquiries: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "serviceNeeded", label: "Service" },
    { key: "message", label: "Message" },
    { key: "createdAt", label: "Date" },
    { key: "status", label: "Status" },
  ],
  referrals: [
    { key: "referrerName", label: "Referrer" },
    { key: "referrerEmail", label: "Referrer Email" },
    { key: "patientName", label: "Patient" },
    { key: "patientPhone", label: "Patient Phone" },
    { key: "serviceNeeded", label: "Service" },
    { key: "createdAt", label: "Date" },
    { key: "status", label: "Status" },
  ],
  applications: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "position", label: "Position" },
    { key: "createdAt", label: "Date" },
    { key: "status", label: "Status" },
  ],
};

// Fields to show in detail modal, grouped
const DETAIL_SECTIONS: Record<TabKey, { title: string; fields: { key: string; label: string }[] }[]> = {
  leads: [
    {
      title: "Contact Info",
      fields: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "preferredContact", label: "Preferred Contact" },
      ],
    },
    {
      title: "Details",
      fields: [
        { key: "serviceNeeded", label: "Service Needed" },
        { key: "message", label: "Message" },
        { key: "source", label: "Source" },
      ],
    },
  ],
  inquiries: [
    {
      title: "Contact Info",
      fields: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
      ],
    },
    {
      title: "Details",
      fields: [
        { key: "serviceNeeded", label: "Service Needed" },
        { key: "message", label: "Message" },
      ],
    },
  ],
  referrals: [
    {
      title: "Referrer Info",
      fields: [
        { key: "referrerName", label: "Name" },
        { key: "referrerEmail", label: "Email" },
        { key: "referrerPhone", label: "Phone" },
      ],
    },
    {
      title: "Patient Info",
      fields: [
        { key: "patientName", label: "Patient Name" },
        { key: "patientPhone", label: "Patient Phone" },
        { key: "serviceNeeded", label: "Service Needed" },
        { key: "notes", label: "Notes" },
      ],
    },
  ],
  applications: [
    {
      title: "Personal Info",
      fields: [
        { key: "firstName", label: "First Name" },
        { key: "lastName", label: "Last Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "address", label: "Address" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "zip", label: "Zip" },
      ],
    },
    {
      title: "Position Details",
      fields: [
        { key: "position", label: "Position Applied For" },
        { key: "desiredPayRate", label: "Desired Pay Rate" },
        { key: "availableStartDate", label: "Available Start Date" },
        { key: "schedulePreference", label: "Schedule Preference" },
        { key: "authorizedToWork", label: "Authorized to Work in US" },
        { key: "felonyConviction", label: "Felony Conviction" },
        { key: "felonyExplanation", label: "Felony Explanation" },
      ],
    },
    {
      title: "Education & Certifications",
      fields: [
        { key: "highestEducation", label: "Highest Education" },
        { key: "schoolName", label: "School Name" },
        { key: "certifications", label: "Certifications" },
        { key: "cprExpiration", label: "CPR Expiration" },
        { key: "driversLicense", label: "Driver's License" },
        { key: "hasReliableTransport", label: "Reliable Transportation" },
      ],
    },
    {
      title: "Employment History",
      fields: [
        { key: "employer1Name", label: "Employer 1" },
        { key: "employer1Title", label: "Title" },
        { key: "employer1Dates", label: "Dates" },
        { key: "employer1Duties", label: "Duties" },
        { key: "employer1ReasonForLeaving", label: "Reason for Leaving" },
        { key: "employer2Name", label: "Employer 2" },
        { key: "employer2Title", label: "Title" },
        { key: "employer2Dates", label: "Dates" },
        { key: "employer2Duties", label: "Duties" },
        { key: "employer2ReasonForLeaving", label: "Reason for Leaving" },
      ],
    },
    {
      title: "References",
      fields: [
        { key: "reference1Name", label: "Reference 1" },
        { key: "reference1Phone", label: "Phone" },
        { key: "reference1Relationship", label: "Relationship" },
        { key: "reference2Name", label: "Reference 2" },
        { key: "reference2Phone", label: "Phone" },
        { key: "reference2Relationship", label: "Relationship" },
      ],
    },
    {
      title: "Additional",
      fields: [
        { key: "resumeNotes", label: "Resume / Notes" },
        { key: "additionalInfo", label: "Additional Info" },
        { key: "message", label: "Message" },
      ],
    },
  ],
};

function getCellValue(row: Record<string, unknown>, key: string, tab: TabKey): string {
  if (key === "name") {
    if (tab === "referrals") return String(row.referrerName ?? "");
    return `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
  }
  if (key === "createdAt") {
    return row.createdAt ? new Date(row.createdAt as string).toLocaleDateString() : "";
  }
  const val = row[key];
  if (val === null || val === undefined) return "—";
  return String(val);
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("leads");
  const [data, setData] = useState<Record<TabKey, Record<string, unknown>[]>>({
    leads: [], inquiries: [], referrals: [], applications: [],
  });
  const [counts, setCounts] = useState<Record<TabKey, number>>({ leads: 0, inquiries: 0, referrals: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const tables: TabKey[] = ["leads", "inquiries", "referrals", "applications"];
    const results = await Promise.all(
      tables.map(async (t) => {
        const res = await fetch(`/api/admin?table=${t}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return { table: t, data: [] };
        }
        const json = await res.json();
        return { table: t, data: Array.isArray(json) ? json : [] };
      })
    );
    const newData = {} as Record<TabKey, Record<string, unknown>[]>;
    const newCounts = {} as Record<TabKey, number>;
    for (const r of results) {
      newData[r.table as TabKey] = r.data;
      newCounts[r.table as TabKey] = r.data.length;
    }
    setData(newData);
    setCounts(newCounts);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/me");
      if (!res.ok) {
        router.push("/admin/login");
        return;
      }
      fetchAll();
    };
    checkAuth();
  }, [router, fetchAll]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, table: activeTab, status }),
    });
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((r) =>
        (r.id as string) === id ? { ...r, status } : r
      ),
    }));
    if (selectedRow && (selectedRow.id as string) === id) {
      setSelectedRow({ ...selectedRow, status });
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin?id=${id}&table=${activeTab}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((r) => (r.id as string) !== id),
      }));
      setCounts((prev) => ({ ...prev, [activeTab]: prev[activeTab] - 1 }));
      setDeleteConfirm(null);
      if (selectedRow && (selectedRow.id as string) === id) {
        setSelectedRow(null);
      }
    }
  };

  const exportCSV = () => {
    window.open(`/api/admin?table=${activeTab}&format=csv`, "_blank");
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-primary" />
      </div>
    );
  }

  const rows = data[activeTab];
  const newCount = rows.filter((r) => r.status === "new").length;
  const columns = TABLE_COLUMNS[activeTab];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-dark">Admin Dashboard</h1>
          <p className="text-sm text-neutral-mid">H&amp;B Home Health — Manage all submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/visits"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8476C] px-4 py-2 text-sm font-medium text-white hover:bg-[#c73a5a]"
          >
            <ClipboardList size={14} /> Visit Logs
          </Link>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-mid hover:border-[#E8476C] hover:text-[#E8476C]"
          >
            <CreditCard size={14} /> Saved Cards
          </Link>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-mid hover:text-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "rounded-xl p-5 text-left transition-all",
              activeTab === tab.key
                ? "ring-2 ring-[#E8476C] bg-white shadow-md"
                : "bg-gray-50 hover:bg-white hover:shadow-sm"
            )}
          >
            <div className="flex items-center gap-3">
              <tab.icon size={22} className={tab.color} />
              <div>
                <p className="text-2xl font-bold text-neutral-dark">{counts[tab.key]}</p>
                <p className="text-sm text-neutral-mid">{tab.label}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Active Tab Header + Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-neutral-dark">{TABS.find((t) => t.key === activeTab)?.label}</h2>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            {newCount} new
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchAll} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-neutral-mid hover:text-neutral-dark">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={exportCSV} className="inline-flex items-center gap-1.5 rounded-lg bg-[#E8476C] px-3 py-1.5 text-sm text-white hover:bg-[#c73a5a]">
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left font-medium text-neutral-mid">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-neutral-mid w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const id = row.id as string;
              return (
                <tr
                  key={id}
                  className="hover:bg-neutral-light/50 cursor-pointer"
                  onClick={() => setSelectedRow(row)}
                >
                  {columns.map((col) => {
                    if (col.key === "status") {
                      return (
                        <td key={col.key} className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={String(row.status ?? "new")}
                            onChange={(e) => updateStatus(id, e.target.value)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium border-0 cursor-pointer",
                              STATUS_COLORS[String(row.status ?? "new")] || "bg-gray-100 text-gray-700"
                            )}
                          >
                            {STATUS_OPTIONS[activeTab].map((s) => (
                              <option key={s} value={s}>{formatLabel(s)}</option>
                            ))}
                          </select>
                        </td>
                      );
                    }
                    if (col.key === "message" || col.key === "notes") {
                      return (
                        <td key={col.key} className="px-4 py-3 text-neutral-mid">
                          <span className="max-w-[200px] truncate block">
                            {getCellValue(row, col.key, activeTab)}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 whitespace-nowrap",
                          col.key === "name" || col.key === "referrerName" || col.key === "patientName"
                            ? "font-medium text-neutral-dark"
                            : "text-neutral-mid"
                        )}
                      >
                        {getCellValue(row, col.key, activeTab)}
                      </td>
                    );
                  })}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {deleteConfirm === id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-xs text-red-600 font-medium hover:text-red-800"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center text-neutral-mid">
                  No {activeTab} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedRow(null)}>
          <div
            className="relative mx-4 max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedRow(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="flex items-center justify-between mb-6 pr-8">
              <h3 className="font-display text-xl font-bold text-neutral-dark">
                {activeTab === "referrals"
                  ? String(selectedRow.referrerName ?? "")
                  : `${selectedRow.firstName ?? ""} ${selectedRow.lastName ?? ""}`}
              </h3>
              <select
                value={String(selectedRow.status ?? "new")}
                onChange={(e) => updateStatus(selectedRow.id as string, e.target.value)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium border-0",
                  STATUS_COLORS[String(selectedRow.status ?? "new")] || "bg-gray-100 text-gray-700"
                )}
              >
                {STATUS_OPTIONS[activeTab].map((s) => (
                  <option key={s} value={s}>{formatLabel(s)}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-neutral-mid mb-6">
              Submitted {selectedRow.createdAt ? new Date(selectedRow.createdAt as string).toLocaleString() : ""}
            </p>

            {DETAIL_SECTIONS[activeTab].map((section) => {
              const filledFields = section.fields.filter((f) => {
                const v = selectedRow[f.key];
                return v !== null && v !== undefined && v !== "";
              });
              if (filledFields.length === 0) return null;
              return (
                <div key={section.title} className="mb-6">
                  <h4 className="text-sm font-semibold text-neutral-dark border-b border-gray-100 pb-2 mb-3">
                    {section.title}
                  </h4>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {filledFields.map((f) => (
                      <div key={f.key} className={f.key.includes("Duties") || f.key === "message" || f.key === "notes" || f.key === "additionalInfo" || f.key === "resumeNotes" || f.key === "felonyExplanation" ? "sm:col-span-2" : ""}>
                        <dt className="text-xs text-neutral-mid">{f.label}</dt>
                        <dd className="text-sm text-neutral-dark mt-0.5 whitespace-pre-wrap">
                          {String(selectedRow[f.key] ?? "")}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                onClick={() => {
                  handleDelete(selectedRow.id as string);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button
                onClick={() => setSelectedRow(null)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-neutral-dark hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
