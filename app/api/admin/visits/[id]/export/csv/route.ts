import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  visitLogs,
  visitLogDays,
  visitLogTasks,
  caregivers,
} from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { DAYS_OF_WEEK, TASKS } from "@/lib/caregiver-tasks";

function csvEscape(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const [log] = await db
    .select({
      id: visitLogs.id,
      patientFirstName: visitLogs.patientFirstName,
      patientLastName: visitLogs.patientLastName,
      patientNo: visitLogs.patientNo,
      voucherNo: visitLogs.voucherNo,
      weekStartDate: visitLogs.weekStartDate,
      serviceTypes: visitLogs.serviceTypes,
      comments: visitLogs.comments,
      cgFirstName: caregivers.firstName,
      cgLastName: caregivers.lastName,
      cgEmployeeNo: caregivers.employeeNo,
      caregiverAttestationAt: visitLogs.caregiverAttestationSignedAt,
      caregiverAttestationIp: visitLogs.caregiverAttestationIp,
    })
    .from(visitLogs)
    .leftJoin(caregivers, eq(caregivers.id, visitLogs.caregiverId))
    .where(eq(visitLogs.id, id))
    .limit(1);
  if (!log) return new Response("Not found", { status: 404 });

  const days = await db
    .select()
    .from(visitLogDays)
    .where(eq(visitLogDays.visitLogId, id))
    .orderBy(asc(visitLogDays.serviceDate));

  const tasks = await db
    .select()
    .from(visitLogTasks)
    .where(eq(visitLogTasks.visitLogId, id));

  const tasksByDay: Record<string, Map<string, { checked: boolean; customLabel: string | null }>> = {};
  for (const t of tasks) {
    if (!tasksByDay[t.dayOfWeek]) tasksByDay[t.dayOfWeek] = new Map();
    tasksByDay[t.dayOfWeek].set(t.taskKey, {
      checked: t.checked ?? false,
      customLabel: t.taskLabelCustom ?? null,
    });
  }

  // One row per day worked. Each task is its own column.
  const taskKeys = TASKS.map((t) => t.key);
  const headers = [
    "caregiver_last_name",
    "caregiver_first_name",
    "caregiver_employee_no",
    "patient_last_name",
    "patient_first_name",
    "patient_no",
    "voucher_no",
    "service_types",
    "service_date",
    "day_of_week",
    "clock_in_at",
    "clock_out_at",
    "total_hours",
    "clock_in_lat",
    "clock_in_lng",
    "clock_in_accuracy_m",
    "clock_out_lat",
    "clock_out_lng",
    "clock_out_accuracy_m",
    ...taskKeys.map((k) => `task_${k}`),
    "patient_signed_by_name",
    "patient_signature_at",
    "patient_signature_ip",
    "caregiver_attestation_at",
    "caregiver_attestation_ip",
    "comments",
  ];

  const lines: string[] = [headers.join(",")];

  for (const day of days) {
    if (!day.clockInAt) continue; // skip days not worked
    const dayTasks = tasksByDay[day.dayOfWeek] ?? new Map();
    const row = [
      log.cgLastName ?? "",
      log.cgFirstName ?? "",
      log.cgEmployeeNo ?? "",
      log.patientLastName,
      log.patientFirstName,
      log.patientNo ?? "",
      log.voucherNo ?? "",
      log.serviceTypes.join("|"),
      new Date(day.serviceDate).toISOString().slice(0, 10),
      day.dayOfWeek,
      day.clockInAt ? new Date(day.clockInAt).toISOString() : "",
      day.clockOutAt ? new Date(day.clockOutAt).toISOString() : "",
      day.totalHours ?? "",
      day.clockInLat ?? "",
      day.clockInLng ?? "",
      day.clockInAccuracyM ?? "",
      day.clockOutLat ?? "",
      day.clockOutLng ?? "",
      day.clockOutAccuracyM ?? "",
      ...taskKeys.map((k) => {
        const t = dayTasks.get(k);
        if (!t) return "";
        if (k === "other_1" || k === "other_2") {
          return t.checked
            ? t.customLabel
              ? `1: ${t.customLabel}`
              : "1"
            : "";
        }
        return t.checked ? "1" : "";
      }),
      day.patientSignedByName ?? "",
      day.patientSignatureAt
        ? new Date(day.patientSignatureAt).toISOString()
        : "",
      day.patientSignatureIp ?? "",
      log.caregiverAttestationAt
        ? new Date(log.caregiverAttestationAt).toISOString()
        : "",
      log.caregiverAttestationIp ?? "",
      log.comments ?? "",
    ];
    lines.push(row.map(csvEscape).join(","));
  }

  const csv = lines.join("\r\n");
  const filename = `HHNotes_${log.patientLastName}_${log.cgEmployeeNo ?? "X"}_${new Date(log.weekStartDate).toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
