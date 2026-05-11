import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays, visitLogTasks } from "@/lib/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { DAYS_OF_WEEK } from "@/lib/caregiver-tasks";
import DayCard from "./_components/DayCard";
import SubmitWeekPanel, { SubmittedBanner } from "./_components/SubmitWeekPanel";

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

  const [days, taskRows] = await Promise.all([
    db
      .select()
      .from(visitLogDays)
      .where(eq(visitLogDays.visitLogId, id))
      .orderBy(asc(visitLogDays.serviceDate)),
    db
      .select()
      .from(visitLogTasks)
      .where(eq(visitLogTasks.visitLogId, id)),
  ]);

  const byDay = new Map(days.map((d) => [d.dayOfWeek, d]));
  const tasksByDay: Record<string, Record<string, { checked: boolean; customLabel: string | null }>> = {};
  for (const t of taskRows) {
    if (!tasksByDay[t.dayOfWeek]) tasksByDay[t.dayOfWeek] = {};
    tasksByDay[t.dayOfWeek][t.taskKey] = {
      checked: t.checked ?? false,
      customLabel: t.taskLabelCustom ?? null,
    };
  }
  const locked = log.status !== "draft";

  const daysComplete = days.filter(
    (d) => d.clockInAt && d.clockOutAt
  ).length;
  const daysStarted = days.filter((d) => d.clockInAt).length;
  const daysReadyToSubmit = days.filter(
    (d) => d.clockInAt && d.clockOutAt && d.patientSignatureAt
  ).length;

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
                patientSignedAt: d.patientSignatureAt
                  ? new Date(d.patientSignatureAt).toISOString()
                  : null,
                patientSignedByName: d.patientSignedByName,
              }}
              initialTasks={tasksByDay[d.dayOfWeek] ?? {}}
            />
          );
        })}
      </div>

      {!locked && (
        <SubmitWeekPanel
          visitLogId={id}
          daysComplete={daysComplete}
          daysStarted={daysStarted}
          daysReadyToSubmit={daysReadyToSubmit}
          totalDays={7}
        />
      )}

      {locked && log.submittedAt && (
        <SubmittedBanner submittedAt={new Date(log.submittedAt).toISOString()} />
      )}
    </div>
  );
}
