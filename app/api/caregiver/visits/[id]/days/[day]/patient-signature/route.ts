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

  const { signaturePng, signatureSvg, signedByName } = body as {
    signaturePng?: string;
    signatureSvg?: string;
    signedByName?: string;
  };

  if (!signaturePng?.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "signaturePng must be a data URL" },
      { status: 400 }
    );
  }
  if (!signedByName?.trim()) {
    return NextResponse.json(
      { error: "signedByName is required" },
      { status: 400 }
    );
  }
  // Sanity-cap size to prevent abuse (50KB is plenty for a signature canvas)
  if (signaturePng.length > 200_000) {
    return NextResponse.json(
      { error: "Signature image too large" },
      { status: 413 }
    );
  }

  // Verify ownership + draft status
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
      { error: "Visit log is already submitted." },
      { status: 409 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const now = new Date();

  await db
    .update(visitLogDays)
    .set({
      patientSignaturePngUrl: signaturePng,
      patientSignatureSvg: signatureSvg ?? null,
      patientSignedByName: signedByName.trim(),
      patientSignatureAt: now,
      patientSignatureIp: ip,
    })
    .where(
      and(eq(visitLogDays.visitLogId, id), eq(visitLogDays.dayOfWeek, day))
    );

  return NextResponse.json({
    ok: true,
    signedByName: signedByName.trim(),
    signedAt: now.toISOString(),
  });
}
