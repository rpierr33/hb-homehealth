import { NextResponse } from "next/server";
import { getCaregiverFromCookie } from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { visitLogs, visitLogDays } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { signaturePng, signatureSvg } = body as {
    signaturePng?: string;
    signatureSvg?: string;
  };

  if (!signaturePng?.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Caregiver signature is required to submit." },
      { status: 400 }
    );
  }
  if (signaturePng.length > 200_000) {
    return NextResponse.json(
      { error: "Signature image too large" },
      { status: 413 }
    );
  }

  // Verify ownership + draft status
  const [parent] = await db
    .select()
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

  // Validate: every day with a clock-in must also have a clock-out AND a patient signature
  const days = await db
    .select()
    .from(visitLogDays)
    .where(eq(visitLogDays.visitLogId, id));

  const completeDays = days.filter(
    (d) => d.clockInAt && d.clockOutAt && d.patientSignatureAt
  );
  const partiallyStarted = days.filter(
    (d) =>
      (d.clockInAt && !d.clockOutAt) ||
      (d.clockInAt && d.clockOutAt && !d.patientSignatureAt)
  );

  if (completeDays.length === 0) {
    return NextResponse.json(
      {
        error:
          "Complete at least one day (clock in, clock out, and patient signature) before submitting.",
      },
      { status: 400 }
    );
  }
  if (partiallyStarted.length > 0) {
    const labels = partiallyStarted.map((d) => d.dayOfWeek).join(", ");
    return NextResponse.json(
      {
        error: `These days are started but incomplete: ${labels}. Finish clock-out and patient signature, or leave the day untouched.`,
      },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  const now = new Date();

  await db
    .update(visitLogs)
    .set({
      status: "submitted",
      submittedAt: now,
      caregiverSignaturePngUrl: signaturePng,
      caregiverSignatureSvg: signatureSvg ?? null,
      caregiverAttestationSignedAt: now,
      caregiverAttestationIp: ip,
      caregiverAttestationUserAgent: ua,
      updatedAt: now,
    })
    .where(eq(visitLogs.id, id));

  return NextResponse.json({
    ok: true,
    status: "submitted",
    submittedAt: now.toISOString(),
    daysComplete: completeDays.length,
  });
}
