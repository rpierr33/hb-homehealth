import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email/templates";
import { z } from "zod/v4";
import { applicationSchema } from "@/lib/validations/schemas";
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

    const data = applicationSchema.parse(body);
    const safe = sanitizeObject(data);

    const supabase = createAdminClient();

    const { error: dbError } = await supabase.from("applications").insert({
      first_name: safe.firstName,
      last_name: safe.lastName,
      email: safe.email,
      phone: safe.phone,
      position: safe.position,
      message: safe.message || null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    try {
      await Promise.all([
        sendConfirmationEmail({
          email: safe.email,
          firstName: safe.firstName,
          type: "application",
        }),
        sendNotificationEmail({
          type: "application",
          details: {
            firstName: safe.firstName,
            lastName: safe.lastName,
            email: safe.email,
            phone: safe.phone,
            position: safe.position,
            message: safe.message,
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
