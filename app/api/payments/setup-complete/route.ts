import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { paymentMethodCaptures } from "@/lib/db/schema";
import { retrieveSetupIntent } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { setupIntentId } = body as { setupIntentId?: string };
  if (!setupIntentId) {
    return NextResponse.json(
      { error: "setupIntentId is required." },
      { status: 400 }
    );
  }

  try {
    const setupIntent = await retrieveSetupIntent(setupIntentId);
    const paymentMethod =
      typeof setupIntent.payment_method === "object"
        ? setupIntent.payment_method
        : null;
    const card = paymentMethod?.card;
    const now = new Date();

    await db
      .update(paymentMethodCaptures)
      .set({
        status: setupIntent.status,
        stripePaymentMethodId: paymentMethod?.id ?? null,
        cardBrand: card?.brand ?? null,
        cardLast4: card?.last4 ?? null,
        cardExpMonth: card?.exp_month ? String(card.exp_month) : null,
        cardExpYear: card?.exp_year ? String(card.exp_year) : null,
        errorMessage:
          setupIntent.status === "succeeded"
            ? null
            : `Stripe setup status: ${setupIntent.status}`,
        updatedAt: now,
      })
      .where(
        eq(paymentMethodCaptures.stripeSetupIntentId, setupIntent.id)
      );

    if (setupIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Card validation did not complete.", status: setupIntent.status },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      card: {
        brand: card?.brand ?? "card",
        last4: card?.last4 ?? "",
        expMonth: card?.exp_month ?? null,
        expYear: card?.exp_year ?? null,
      },
    });
  } catch (err) {
    console.error("Complete setup intent error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Could not verify saved card.",
      },
      { status: 500 }
    );
  }
}
