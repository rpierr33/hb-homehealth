import { redirect } from "next/navigation";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { caregivers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FileText, Clock, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./_components/LogoutButton";

export const metadata = {
  title: "Caregiver Dashboard",
  robots: { index: false, follow: false },
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
      languagePref: caregivers.languagePref,
    })
    .from(caregivers)
    .where(eq(caregivers.id, token.sub))
    .limit(1);

  if (!me) redirect("/caregiver/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/caregiver/visits/new"
          className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#E8476C] hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8476C]/10 text-[#E8476C] group-hover:bg-[#E8476C] group-hover:text-white">
            <Plus size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-neutral-dark">
            New visit log
          </h2>
          <p className="mt-1 text-sm text-neutral-mid">
            Start a new weekly HHA Notes entry.
          </p>
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 opacity-60">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <FileText size={24} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-neutral-dark">
            My submissions
          </h2>
          <p className="mt-1 text-sm text-neutral-mid">
            Coming next — list of submitted weekly logs.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <Clock size={16} className="mb-1 inline" />{" "}
        <strong>Phase 1A scaffold.</strong> Auth + dashboard live. Wizard (1B),
        submission pipeline (1C), exports (1D) come next per the spec.
      </div>
    </div>
  );
}
