import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays } from "@/lib/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { DAYS_OF_WEEK } from "@/lib/caregiver-tasks";
import DayCard from "./_components/DayCard";

export const metadata = {
  title: "Weekly Visit Log",
  robots: { index: false, follow: false },
};

export default async function WeeklyLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCaregiverFromCookie();
  if (!me) redirect("/caregiver/login");

  const [log] = await db
    .select()
    .from(visitLogs)
    .where(and(eq(visitLogs.id, id), eq(visitLogs.caregiverId, me.sub)))
    .limit(1);
  if (!log) notFound();

  const days = await db
    .select()
    .from(visitLogDays)
    .where(eq(visitLogDays.visitLogId, id))
    .orderBy(asc(visitLogDays.serviceDate));

  const byDay = new Map(days.map((d) => [d.dayOfWeek, d]));
  const locked = log.status !== "draft";

  const daysComplete = days.filter(
    (d) => d.clockInAt && d.clockOutAt
  ).length;
  const daysStarted = days.filter((d) => d.clockInAt).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/caregiver"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-mid hover:text-[#E8476C]"
      >
        <ChevronLeft size={16} /> Back to dashboard
      </Link>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8476C]">
              Weekly Visit Log
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-neutral-dark">
              {log.patientLastName}, {log.patientFirstName}
            </h1>
            <p className="mt-1 text-sm text-neutral-mid">
              Week of {log.weekStartDate}
              {log.serviceTypes.length > 0 && (
                <>
                  {" · "}
                  {log.serviceTypes.map((s) => s.replace(/_/g, " ")).join(", ")}
                </>
              )}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              log.status === "draft"
                ? "bg-amber-100 text-amber-800"
                : log.status === "submitted"
                  ? "bg-blue-100 text-blue-800"
                  : log.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
            }`}
          >
            {log.status}
          </span>
        </div>

        <p className="mt-4 text-xs text-neutral-mid">
          Tap Clock In when you start a visit; Clock Out when you finish. GPS
          and time are captured automatically. Empty day cards mean you
          didn&apos;t work that day — that&apos;s fine.
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {DAYS_OF_WEEK.map((dayKey) => {
          const d = byDay.get(dayKey);
          if (!d) return null;
          return (
            <DayCard
              key={d.id}
              visitLogId={id}
              locked={locked}
              initial={{
                day: d.dayOfWeek,
                serviceDate: d.serviceDate,
                clockInAt: d.clockInAt
                  ? new Date(d.clockInAt).toISOString()
                  : null,
                clockOutAt: d.clockOutAt
                  ? new Date(d.clockOutAt).toISOString()
                  : null,
                totalHours: d.totalHours,
                clockInLat: d.clockInLat,
                clockInLng: d.clockInLng,
              }}
            />
          );
        })}
      </div>

      {!locked && (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-neutral-dark">Submit this week</h2>
          <p className="mt-1 text-sm text-neutral-mid">
            {daysComplete === 7
              ? "All 7 days are complete. Ready to submit."
              : daysStarted === 0
                ? "Start by clocking in on a day card above."
                : `${daysComplete} of 7 days complete, ${daysStarted} started. You can submit a partial week — empty days will be treated as days you didn't work.`}
          </p>
          <button
            type="button"
            disabled={daysComplete === 0}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#E8476C] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={14} />
            {daysComplete === 7
              ? "Submit Week"
              : `Submit Week (${daysComplete} of 7 days)`}
          </button>
          <p className="mt-2 text-xs text-neutral-mid">
            Final attestation + caregiver signature is on the next screen.
            (Submit flow is Phase 1B-5 — not yet wired up.)
          </p>
        </div>
      )}
    </div>
  );
}
