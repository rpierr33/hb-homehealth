import { NextResponse } from "next/server";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { DAYS_OF_WEEK, type DayOfWeek } from "@/lib/caregiver-tasks";

function isValidDay(d: string): d is DayOfWeek {
  return (DAYS_OF_WEEK as readonly string[]).includes(d);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; day: string }> }
) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, day } = await params;
  if (!isValidDay(day)) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { action, lat, lng, accuracy } = body as {
    action?: "clock-in" | "clock-out";
    lat?: number;
    lng?: number;
    accuracy?: number;
  };

  if (action !== "clock-in" && action !== "clock-out") {
    return NextResponse.json(
      { error: "action must be 'clock-in' or 'clock-out'" },
      { status: 400 }
    );
  }

  // Verify the visit log belongs to this caregiver and isn't submitted/approved (locked).
  const [parent] = await db
    .select({ id: visitLogs.id, status: visitLogs.status })
    .from(visitLogs)
    .where(and(eq(visitLogs.id, id), eq(visitLogs.caregiverId, me.sub)))
    .limit(1);
  if (!parent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (parent.status !== "draft") {
    return NextResponse.json(
      { error: "Visit log is already submitted and cannot be modified." },
      { status: 409 }
    );
  }

  const now = new Date();
  const updates =
    action === "clock-in"
      ? {
          clockInAt: now,
          clockInLat: lat != null ? String(lat) : null,
          clockInLng: lng != null ? String(lng) : null,
          clockInAccuracyM: accuracy != null ? String(accuracy) : null,
        }
      : {
          clockOutAt: now,
          clockOutLat: lat != null ? String(lat) : null,
          clockOutLng: lng != null ? String(lng) : null,
          clockOutAccuracyM: accuracy != null ? String(accuracy) : null,
        };

  // Update; if both in/out present, compute total_hours.
  await db
    .update(visitLogDays)
    .set(updates)
    .where(and(eq(visitLogDays.visitLogId, id), eq(visitLogDays.dayOfWeek, day)));

  const [updated] = await db
    .select()
    .from(visitLogDays)
    .where(and(eq(visitLogDays.visitLogId, id), eq(visitLogDays.dayOfWeek, day)))
    .limit(1);

  if (updated.clockInAt && updated.clockOutAt) {
    const hours =
      (new Date(updated.clockOutAt).getTime() -
        new Date(updated.clockInAt).getTime()) /
      (1000 * 60 * 60);
    await db
      .update(visitLogDays)
      .set({ totalHours: hours.toFixed(2) })
      .where(
        and(eq(visitLogDays.visitLogId, id), eq(visitLogDays.dayOfWeek, day))
      );
    updated.totalHours = hours.toFixed(2);
  }

  return NextResponse.json({
    day: updated.dayOfWeek,
    serviceDate: updated.serviceDate,
    clockInAt: updated.clockInAt,
    clockOutAt: updated.clockOutAt,
    totalHours: updated.totalHours,
    clockInLat: updated.clockInLat,
    clockInLng: updated.clockInLng,
    clockOutLat: updated.clockOutLat,
    clockOutLng: updated.clockOutLng,
  });
}
