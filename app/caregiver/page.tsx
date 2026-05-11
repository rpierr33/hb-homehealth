import { redirect } from "next/navigation";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { caregivers, visitLogs } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { FileText, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./_components/LogoutButton";
import DuplicateButton from "./_components/DuplicateButton";

export const metadata = {
  title: "Caregiver Dashboard",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-100 text-amber-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default async function CaregiverDashboard() {
  const token = await getCaregiverFromCookie();
  if (!token) redirect("/caregiver/login");

  const [me] = await db
    .select({
      id: caregivers.id,
      firstName: caregivers.firstName,
      lastName: caregivers.lastName,
      employeeNo: caregivers.employeeNo,
    })
    .from(caregivers)
    .where(eq(caregivers.id, token.sub))
    .limit(1);

  if (!me) redirect("/caregiver/login");

  const recent = await db
    .select({
      id: visitLogs.id,
      patientFirstName: visitLogs.patientFirstName,
      patientLastName: visitLogs.patientLastName,
      weekStartDate: visitLogs.weekStartDate,
      status: visitLogs.status,
      submittedAt: visitLogs.submittedAt,
      createdAt: visitLogs.createdAt,
    })
    .from(visitLogs)
    .where(eq(visitLogs.caregiverId, me.id))
    .orderBy(desc(visitLogs.createdAt))
    .limit(10);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-[#E8476C]">
            Caregiver Portal
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold text-neutral-dark">
            Welcome, {me.firstName}
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            Employee No. {me.employeeNo}
          </p>
        </div>
        <LogoutButton />
      </div>

      <Link
        href="/caregiver/visits/new"
        className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#E8476C] hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8476C]/10 text-[#E8476C] group-hover:bg-[#E8476C] group-hover:text-white">
            <Plus size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-dark">
              Start a new visit log
            </h2>
            <p className="mt-0.5 text-sm text-neutral-mid">
              For a new patient or new week.
            </p>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="text-neutral-mid group-hover:text-[#E8476C]"
        />
      </Link>

      <h2 className="mt-10 mb-3 font-display text-lg font-semibold text-neutral-dark">
        Recent visit logs
      </h2>

      {recent.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
          <FileText size={28} className="mx-auto text-neutral-mid" />
          <p className="mt-3 text-sm font-medium text-neutral-dark">
            No visit logs yet
          </p>
          <p className="mt-1 text-xs text-neutral-mid">
            Tap &ldquo;Start a new visit log&rdquo; above to begin.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {recent.map((log) => (
            <li
              key={log.id}
              className="rounded-2xl border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <Link
                  href={`/caregiver/visits/${log.id}`}
                  className="flex-1"
                >
                  <p className="font-semibold text-neutral-dark">
                    {log.patientLastName}, {log.patientFirstName}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-mid">
                    Week of {log.weekStartDate}
                    {log.submittedAt && (
                      <>
                        {" · "}submitted{" "}
                        {new Date(log.submittedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </Link>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_STYLES[log.status ?? "draft"] ?? STATUS_STYLES.draft
                  }`}
                >
                  {log.status}
                </span>
                <DuplicateButton
                  sourceLogId={log.id}
                  patientFirstName={log.patientFirstName}
                  patientLastName={log.patientLastName}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
