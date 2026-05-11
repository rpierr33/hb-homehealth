import { NextResponse } from "next/server";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays } from "@/lib/db/schema";
import { DAYS_OF_WEEK } from "@/lib/caregiver-tasks";

function addDays(isoDate: string, n: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

export async function POST(request: Request) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { patientFirstName, patientLastName, serviceTypes, weekStartDate } =
    body as {
      patientFirstName?: string;
      patientLastName?: string;
      serviceTypes?: string[];
      weekStartDate?: string;
    };

  if (
    !patientFirstName?.trim() ||
    !patientLastName?.trim() ||
    !serviceTypes?.length ||
    !weekStartDate
  ) {
    return NextResponse.json(
      { error: "Patient name, service type, and week start are all required." },
      { status: 400 }
    );
  }

  try {
    const [created] = await db
      .insert(visitLogs)
      .values({
        caregiverId: me.sub,
        patientFirstName: patientFirstName.trim(),
        patientLastName: patientLastName.trim(),
        serviceTypes,
        weekStartDate,
        status: "draft",
      })
      .returning({ id: visitLogs.id });

    // Pre-create 7 day rows (Mon..Sun) so the weekly view always has a card per day.
    await db.insert(visitLogDays).values(
      DAYS_OF_WEEK.map((day, idx) => ({
        visitLogId: created.id,
        dayOfWeek: day,
        serviceDate: addDays(weekStartDate, idx),
      }))
    );

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err: unknown) {
    console.error("Create visit error:", err);
    return NextResponse.json(
      { error: "Failed to create visit log" },
      { status: 500 }
    );
  }
}
