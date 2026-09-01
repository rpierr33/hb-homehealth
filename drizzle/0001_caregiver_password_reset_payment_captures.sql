ALTER TABLE "caregivers"
ADD COLUMN IF NOT EXISTS "password_reset_required" boolean DEFAULT false;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_method_captures" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "customer_name" text NOT NULL,
  "customer_email" text NOT NULL,
  "customer_phone" text,
  "stripe_customer_id" text NOT NULL,
  "stripe_setup_intent_id" text NOT NULL,
  "stripe_payment_method_id" text,
  "card_brand" text,
  "card_last4" text,
  "card_exp_month" text,
  "card_exp_year" text,
  "status" text DEFAULT 'setup_created',
  "error_message" text,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "payment_method_captures_stripe_setup_intent_id_unique" UNIQUE("stripe_setup_intent_id")
);
