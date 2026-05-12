import { NextResponse } from "next/server";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { DAYS_OF_WEEK, getMondayOfWeek } from "@/lib/caregiver-tasks";

function addDays(isoDate: string, n: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const [source] = await db
    .select({
      patientFirstName: visitLogs.patientFirstName,
      patientLastName: visitLogs.patientLastName,
      patientNo: visitLogs.patientNo,
      voucherNo: visitLogs.voucherNo,
      serviceTypes: visitLogs.serviceTypes,
    })
    .from(visitLogs)
    .where(and(eq(visitLogs.id, id), eq(visitLogs.caregiverId, me.sub)))
    .limit(1);

  if (!source) {
    return NextResponse.json({ error: "Source log not found" }, { status: 404 });
  }

  const weekStartDate = getMondayOfWeek();

  try {
    const [created] = await db
      .insert(visitLogs)
      .values({
        caregiverId: me.sub,
        patientFirstName: source.patientFirstName,
        patientLastName: source.patientLastName,
        patientNo: source.patientNo,
        voucherNo: source.voucherNo,
        serviceTypes: source.serviceTypes,
        weekStartDate,
        status: "draft",
      })
      .returning({ id: visitLogs.id });

    await db.insert(visitLogDays).values(
      DAYS_OF_WEEK.map((day, idx) => ({
        visitLogId: created.id,
        dayOfWeek: day,
        serviceDate: addDays(weekStartDate, idx),
      }))
    );

    return NextResponse.json({ id: created.id }, { status: 201 });
  } catch (err) {
    console.error("Duplicate visit error:", err);
    return NextResponse.json(
      { error: "Could not duplicate visit log" },
      { status: 500 }
    );
  }
}
