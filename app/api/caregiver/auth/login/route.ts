import { NextResponse } from "next/server";
import {
  authenticateCaregiver,
  createCaregiverToken,
  setCaregiverAuthCookie,
} from "@/lib/caregiver-auth";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { success } = checkRateLimit(`caregiver-login:${ip}`, 5, 900000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateCaregiver(email, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createCaregiverToken({
      sub: user.id,
      email: user.email,
      employeeNo: user.employeeNo,
    });
    await setCaregiverAuthCookie(token);

    return NextResponse.json({
      success: true,
      caregiver: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        employeeNo: user.employeeNo,
        languagePref: user.languagePref,
      },
    });
  } catch (err) {
    console.error("Caregiver login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
