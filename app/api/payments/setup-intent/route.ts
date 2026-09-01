import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentMethodCaptures } from "@/lib/db/schema";
import {
  createCardSetupIntent,
  createStripeCustomer,
  getStripePublishableKey,
  isStripeConfigured,
} from "@/lib/stripe";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe is not configured yet." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, phone } = body as {
    name?: string;
    email?: string;
    phone?: string;
  };

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email?.trim() || !isEmail(email.trim())) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  try {
    const customer = await createStripeCustomer({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
    });
    const setupIntent = await createCardSetupIntent({
      customerId: customer.id,
      customerEmail: email.trim().toLowerCase(),
    });

    await db.insert(paymentMethodCaptures).values({
      customerName: name.trim(),
      customerEmail: email.trim().toLowerCase(),
      customerPhone: phone?.trim() || null,
      stripeCustomerId: customer.id,
      stripeSetupIntentId: setupIntent.id,
      status: setupIntent.status,
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
      publishableKey: getStripePublishableKey(),
    });
  } catch (err) {
    console.error("Create setup intent error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not start card validation.",
      },
      { status: 500 }
    );
  }
}
