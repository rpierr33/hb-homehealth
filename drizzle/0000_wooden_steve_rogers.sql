-- Migration: caregiver portal foundation (Phase 1A)
-- Generated: 2026-05-11
-- Spec: docs/CAREGIVER_PORTAL_SPEC.md §6
-- Additive only. Existing tables (admin_users, applications, inquiries, leads, referrals)
-- are untouched. Drizzle's auto-generated SQL included CREATE TABLE for them because
-- the project had no prior migration history (used `db:push`); those redundant
-- statements were removed by hand to keep this migration purely additive.

CREATE TABLE "caregivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"employee_no" text NOT NULL,
	"language_pref" text DEFAULT 'en',
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "caregivers_email_unique" UNIQUE("email"),
	CONSTRAINT "caregivers_employee_no_unique" UNIQUE("employee_no")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"patient_no" text NOT NULL,
	"street" text,
	"city" text,
	"state" text,
	"zip" text,
	"address_lat" numeric,
	"address_lng" numeric,
	"payer" text DEFAULT 'simply',
	"medicaid_id" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "patients_patient_no_unique" UNIQUE("patient_no")
);
--> statement-breakpoint
CREATE TABLE "visit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"caregiver_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"voucher_no" text NOT NULL,
	"week_start_date" date NOT NULL,
	"service_types" text[] NOT NULL,
	"comments" text,
	"status" text DEFAULT 'draft',
	"caregiver_signature_png_url" text,
	"caregiver_signature_svg" text,
	"caregiver_attestation_signed_at" timestamp with time zone,
	"caregiver_attestation_ip" text,
	"caregiver_attestation_user_agent" text,
	"submitted_at" timestamp with time zone,
	"approved_at" timestamp with time zone,
	"approved_by" uuid,
	"rejected_at" timestamp with time zone,
	"rejection_reason" text,
	"dp_use_1" text,
	"dp_use_2" text,
	"dp_use_3" text,
	"dp_use_4" text,
	"pdf_url" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "visit_logs_caregiver_patient_week_voucher_unique" UNIQUE("caregiver_id","patient_id","week_start_date","voucher_no")
);
--> statement-breakpoint
CREATE TABLE "visit_log_days" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"visit_log_id" uuid NOT NULL,
	"day_of_week" text NOT NULL,
	"service_date" date NOT NULL,
	"clock_in_at" timestamp with time zone,
	"clock_in_lat" numeric,
	"clock_in_lng" numeric,
	"clock_in_accuracy_m" numeric,
	"clock_out_at" timestamp with time zone,
	"clock_out_lat" numeric,
	"clock_out_lng" numeric,
	"clock_out_accuracy_m" numeric,
	"total_hours" numeric,
	"patient_signature_png_url" text,
	"patient_signature_svg" text,
	"patient_signature_at" timestamp with time zone,
	"patient_signature_ip" text,
	"patient_signed_by_name" text,
	CONSTRAINT "visit_log_days_visit_log_day_unique" UNIQUE("visit_log_id","day_of_week")
);
--> statement-breakpoint
CREATE TABLE "visit_log_tasks" (
	"visit_log_id" uuid NOT NULL,
	"day_of_week" text NOT NULL,
	"task_key" text NOT NULL,
	"task_label_custom" text,
	"checked" boolean DEFAULT false,
	CONSTRAINT "visit_log_tasks_visit_log_id_day_of_week_task_key_pk" PRIMARY KEY("visit_log_id","day_of_week","task_key")
);
--> statement-breakpoint
ALTER TABLE "visit_log_days" ADD CONSTRAINT "visit_log_days_visit_log_id_visit_logs_id_fk" FOREIGN KEY ("visit_log_id") REFERENCES "public"."visit_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_log_tasks" ADD CONSTRAINT "visit_log_tasks_visit_log_id_visit_logs_id_fk" FOREIGN KEY ("visit_log_id") REFERENCES "public"."visit_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_logs" ADD CONSTRAINT "visit_logs_caregiver_id_caregivers_id_fk" FOREIGN KEY ("caregiver_id") REFERENCES "public"."caregivers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_logs" ADD CONSTRAINT "visit_logs_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visit_logs" ADD CONSTRAINT "visit_logs_approved_by_admin_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;
