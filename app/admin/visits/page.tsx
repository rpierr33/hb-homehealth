import Link from "next/link";
import { db } from "@/lib/db";
import { visitLogs, caregivers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { ArrowRight, FileText } from "lucide-react";

export const metadata = {
  title: "Visit Logs · Admin",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100 text-amber-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function AdminVisitsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const statusFilter = sp.status;

  let rows;
  if (statusFilter) {
    rows = await db
      .select({
        id: visitLogs.id,
        patientFirstName: visitLogs.patientFirstName,
        patientLastName: visitLogs.patientLastName,
        weekStartDate: visitLogs.weekStartDate,
        status: visitLogs.status,
        submittedAt: visitLogs.submittedAt,
        createdAt: visitLogs.createdAt,
        caregiverFirstName: caregivers.firstName,
        caregiverLastName: caregivers.lastName,
        caregiverEmployeeNo: caregivers.employeeNo,
      })
      .from(visitLogs)
      .leftJoin(caregivers, eq(caregivers.id, visitLogs.caregiverId))
      .where(eq(visitLogs.status, statusFilter))
      .orderBy(desc(visitLogs.submittedAt), desc(visitLogs.createdAt));
  } else {
    rows = await db
      .select({
        id: visitLogs.id,
        patientFirstName: visitLogs.patientFirstName,
        patientLastName: visitLogs.patientLastName,
        weekStartDate: visitLogs.weekStartDate,
        status: visitLogs.status,
        submittedAt: visitLogs.submittedAt,
        createdAt: visitLogs.createdAt,
        caregiverFirstName: caregivers.firstName,
        caregiverLastName: caregivers.lastName,
        caregiverEmployeeNo: caregivers.employeeNo,
      })
      .from(visitLogs)
      .leftJoin(caregivers, eq(caregivers.id, visitLogs.caregiverId))
      .orderBy(desc(visitLogs.submittedAt), desc(visitLogs.createdAt));
  }

  const filters = [
    { key: "all", label: "All", href: "/admin/visits" },
    { key: "submitted", label: "Submitted", href: "/admin/visits?status=submitted" },
    { key: "approved", label: "Approved", href: "/admin/visits?status=approved" },
    { key: "draft", label: "Draft", href: "/admin/visits?status=draft" },
    { key: "rejected", label: "Rejected", href: "/admin/visits?status=rejected" },
  ];
  const activeFilter = statusFilter || "all";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[#E8476C]">
            Admin
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-neutral-dark">
            Caregiver Visit Logs
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            All weekly HHA Notes submitted through the caregiver portal.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm font-medium text-neutral-mid hover:text-neutral-dark"
        >
          ← Admin home
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.href}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              activeFilter === f.key
                ? "border-[#E8476C] bg-[#E8476C] text-white"
                : "border-gray-200 bg-white text-neutral-mid hover:border-[#E8476C] hover:text-[#E8476C]"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <FileText size={32} className="mx-auto text-neutral-mid" />
          <p className="mt-3 text-sm font-medium text-neutral-dark">
            No visit logs {statusFilter ? `with status "${statusFilter}"` : "yet"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-neutral-mid">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Caregiver</th>
                <th className="px-4 py-3 text-left font-semibold">Patient</th>
                <th className="px-4 py-3 text-left font-semibold">Week</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-dark">
                      {r.caregiverLastName}, {r.caregiverFirstName}
                    </p>
                    <p className="text-xs text-neutral-mid">
                      #{r.caregiverEmployeeNo}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-dark">
                    {r.patientLastName}, {r.patientFirstName}
                  </td>
                  <td className="px-4 py-3 text-neutral-mid">
                    {new Date(r.weekStartDate).toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[r.status ?? "draft"] ??
                        STATUS_STYLES.draft
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-mid">
                    {r.submittedAt
                      ? new Date(r.submittedAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/visits/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-neutral-dark transition-all hover:border-[#E8476C] hover:text-[#E8476C]"
                    >
                      View <ArrowRight size={11} />
                    </Link>
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
