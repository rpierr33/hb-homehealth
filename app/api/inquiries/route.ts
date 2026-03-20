import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendConfirmationEmail, sendNotificationEmail } from "@/lib/email/templates";
import { z } from "zod/v4";
import { contactSchema } from "@/lib/validations/schemas";
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

    const data = contactSchema.parse(body);
    const safe = sanitizeObject(data);

    const supabase = createAdminClient();

    const { error: dbError } = await supabase.from("inquiries").insert({
      first_name: safe.firstName,
      last_name: safe.lastName,
      email: safe.email,
      phone: safe.phone,
      service_needed: safe.serviceNeeded,
      message: safe.message || null,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Send emails (non-blocking)
    try {
      await Promise.all([
        sendConfirmationEmail({
          email: safe.email,
          firstName: safe.firstName,
          type: "inquiry",
        }),
        sendNotificationEmail({
          type: "inquiry",
          details: {
            firstName: safe.firstName,
            lastName: safe.lastName,
            email: safe.email,
            phone: safe.phone,
            serviceNeeded: safe.serviceNeeded,
            message: safe.message,
          },
        }),
      ]);
    } catch (emailError) {
      console.error("Email error:", emailError);
      // Don't fail the request if emails fail
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
