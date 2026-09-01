import { NextResponse } from "next/server";
import {
  createCaregiverToken,
  getCaregiverFromCookie,
  hashCaregiverPassword,
  setCaregiverAuthCookie,
} from "@/lib/caregiver-auth";
import { db } from "@/lib/db";
import { caregivers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const me = await getCaregiverFromCookie();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { password, confirmPassword } = body as {
    password?: string;
    confirmPassword?: string;
  };

  if (!password || password.length < 10) {
    return NextResponse.json(
      { error: "Password must be at least 10 characters." },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 }
    );
  }

  const passwordHash = await hashCaregiverPassword(password);
  const now = new Date();

  const [updated] = await db
    .update(caregivers)
    .set({
      passwordHash,
      passwordResetRequired: false,
      updatedAt: now,
    })
    .where(eq(caregivers.id, me.sub))
    .returning({
      id: caregivers.id,
      email: caregivers.email,
      employeeNo: caregivers.employeeNo,
    });

  if (!updated) {
    return NextResponse.json({ error: "Caregiver not found" }, { status: 404 });
  }

  const token = await createCaregiverToken({
    sub: updated.id,
    email: updated.email,
    employeeNo: updated.employeeNo,
    passwordResetRequired: false,
  });
  await setCaregiverAuthCookie(token);

  return NextResponse.json({ ok: true });
}
