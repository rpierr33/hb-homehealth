import { NextResponse } from "next/server";
import { clearCaregiverAuthCookie } from "@/lib/caregiver-auth";

export async function POST() {
  await clearCaregiverAuthCookie();
  return NextResponse.json({ success: true });
}
