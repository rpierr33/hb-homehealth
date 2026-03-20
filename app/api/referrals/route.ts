import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email/templates";
import { z } from "zod/v4";
import { referralSchema } from "@/lib/validations/schemas";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeObject } from "@/lib/sanitize";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const { success } = checkRateLimit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const data = referralSchema.parse(body);
    const safe = sanitizeObject(data);

    const supabase = createAdminClient();

    const { error: dbError } = await supabase.from("referrals").insert({
      referrer_name: safe.referrerName,
      referrer_phone: safe.referrerPhone,
      referrer_email: safe.referrerEmail,
      patient_name: safe.patientName,
      patient_phone: safe.patientPhone,
      service_needed: safe.serviceNeeded,
      notes: safe.notes || null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      await Promise.all([
        sendConfirmationEmail({
          email: safe.referrerEmail,
          firstName: safe.referrerName.split(" ")[0],
          type: "referral",
        }),
        sendNotificationEmail({
          type: "referral",
          details: {
            referrerName: safe.referrerName,
            referrerPhone: safe.referrerPhone,
            referrerEmail: safe.referrerEmail,
            patientName: safe.patientName,
            patientPhone: safe.patientPhone,
            serviceNeeded: safe.serviceNeeded,
            notes: safe.notes,
          },
        }),
      ]);
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", issues: err.issues }, { status: 400 });
    }
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
