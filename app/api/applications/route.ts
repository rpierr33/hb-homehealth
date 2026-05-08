import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
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

    try {
      await db.insert(applications).values({
        firstName: safe.firstName,
        lastName: safe.lastName,
        email: safe.email,
        phone: safe.phone,
        position: safe.positionAppliedFor || safe.position || "Not specified",
        address: safe.address || null,
        city: safe.city || null,
        state: safe.state || null,
        zip: safe.zip || null,
        desiredPayRate: safe.desiredPayRate || null,
        availableStartDate: safe.availableStartDate || null,
        schedulePreference: safe.schedulePreference || null,
        authorizedToWork: safe.authorizedToWork || null,
        felonyConviction: safe.felonyConviction || null,
        felonyExplanation: safe.felonyExplanation || null,
        highestEducation: safe.highestEducation || null,
        schoolName: safe.schoolName || null,
        certifications: safe.certifications || null,
        cprExpiration: safe.cprExpiration || null,
        driversLicense: safe.driversLicense || null,
        hasReliableTransport: safe.hasReliableTransport || null,
        employer1Name: safe.employer1Name || null,
        employer1Title: safe.employer1Title || null,
        employer1Dates: safe.employer1Dates || null,
        employer1Duties: safe.employer1Duties || null,
        employer1ReasonForLeaving: safe.employer1ReasonForLeaving || null,
        employer2Name: safe.employer2Name || null,
        employer2Title: safe.employer2Title || null,
        employer2Dates: safe.employer2Dates || null,
        employer2Duties: safe.employer2Duties || null,
        employer2ReasonForLeaving: safe.employer2ReasonForLeaving || null,
        reference1Name: safe.reference1Name || null,
        reference1Phone: safe.reference1Phone || null,
        reference1Relationship: safe.reference1Relationship || null,
        reference2Name: safe.reference2Name || null,
        reference2Phone: safe.reference2Phone || null,
        reference2Relationship: safe.reference2Relationship || null,
        resumeNotes: safe.resumeNotes || null,
        additionalInfo: safe.additionalInfo || null,
        agreesToTerms: safe.agreesToTerms === true || safe.agreesToTerms === "true",
        message: safe.message || null,
      });
    } catch (dbError) {
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
            position: safe.positionAppliedFor || safe.position || "Not specified",
            message: safe.additionalInfo || safe.message,
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
