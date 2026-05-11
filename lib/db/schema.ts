import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  numeric,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceNeeded: text("service_needed"),
  message: text("message"),
  preferredContact: text("preferred_contact"),
  source: text("source").default("website"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceNeeded: text("service_needed").notNull(),
  message: text("message"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerName: text("referrer_name").notNull(),
  referrerPhone: text("referrer_phone").notNull(),
  referrerEmail: text("referrer_email").notNull(),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  serviceNeeded: text("service_needed").notNull(),
  notes: text("notes"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  position: text("position").notNull(),
  desiredPayRate: text("desired_pay_rate"),
  availableStartDate: text("available_start_date"),
  schedulePreference: text("schedule_preference"),
  authorizedToWork: text("authorized_to_work"),
  felonyConviction: text("felony_conviction"),
  felonyExplanation: text("felony_explanation"),
  highestEducation: text("highest_education"),
  schoolName: text("school_name"),
  certifications: text("certifications"),
  cprExpiration: text("cpr_expiration"),
  driversLicense: text("drivers_license"),
  hasReliableTransport: text("has_reliable_transport"),
  employer1Name: text("employer1_name"),
  employer1Title: text("employer1_title"),
  employer1Dates: text("employer1_dates"),
  employer1Duties: text("employer1_duties"),
  employer1ReasonForLeaving: text("employer1_reason_for_leaving"),
  employer2Name: text("employer2_name"),
  employer2Title: text("employer2_title"),
  employer2Dates: text("employer2_dates"),
  employer2Duties: text("employer2_duties"),
  employer2ReasonForLeaving: text("employer2_reason_for_leaving"),
  reference1Name: text("reference1_name"),
  reference1Phone: text("reference1_phone"),
  reference1Relationship: text("reference1_relationship"),
  reference2Name: text("reference2_name"),
  reference2Phone: text("reference2_phone"),
  reference2Relationship: text("reference2_relationship"),
  resumeNotes: text("resume_notes"),
  additionalInfo: text("additional_info"),
  agreesToTerms: boolean("agrees_to_terms").default(false),
  message: text("message"),
  status: text("status").default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// CAREGIVER PORTAL — Phase 1 tables (additive; no existing tables modified)
// Spec: docs/CAREGIVER_PORTAL_SPEC.md §6
// ---------------------------------------------------------------------------

export const caregivers = pgTable("caregivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  employeeNo: text("employee_no").notNull().unique(),
  languagePref: text("language_pref").default("en"), // 'en' | 'es'
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// NOTE: No separate `patients` table. Per the Phase 1 constraint, patient
// information is entered by the caregiver per-visit and lives only on the
// visit_logs row. Full HIPAA-compliant multi-tenant patient roster comes in
// Phase 2 (the standalone B2B product) when BAAs are in place.
// See memory: feedback_no_patient_roster_in_hb.md

export const visitLogs = pgTable(
  "visit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caregiverId: uuid("caregiver_id")
      .notNull()
      .references(() => caregivers.id),
    // Patient info — typed by caregiver, no separate roster
    patientFirstName: text("patient_first_name").notNull(),
    patientLastName: text("patient_last_name").notNull(),
    patientNo: text("patient_no"), // optional — admin can backfill at review
    voucherNo: text("voucher_no"), // optional — admin can backfill at review
    weekStartDate: date("week_start_date").notNull(), // always a Monday
    serviceTypes: text("service_types").array().notNull(),
    comments: text("comments"),
    status: text("status").default("draft"),
    caregiverSignaturePngUrl: text("caregiver_signature_png_url"),
    caregiverSignatureSvg: text("caregiver_signature_svg"),
    caregiverAttestationSignedAt: timestamp("caregiver_attestation_signed_at", {
      withTimezone: true,
    }),
    caregiverAttestationIp: text("caregiver_attestation_ip"),
    caregiverAttestationUserAgent: text("caregiver_attestation_user_agent"),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    approvedBy: uuid("approved_by").references(() => adminUsers.id),
    rejectedAt: timestamp("rejected_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),
    dpUse1: text("dp_use_1"),
    dpUse2: text("dp_use_2"),
    dpUse3: text("dp_use_3"),
    dpUse4: text("dp_use_4"),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
);

export const visitLogDays = pgTable(
  "visit_log_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    visitLogId: uuid("visit_log_id")
      .notNull()
      .references(() => visitLogs.id, { onDelete: "cascade" }),
    dayOfWeek: text("day_of_week").notNull(), // 'mon'..'sun'
    serviceDate: date("service_date").notNull(),
    clockInAt: timestamp("clock_in_at", { withTimezone: true }),
    clockInLat: numeric("clock_in_lat"),
    clockInLng: numeric("clock_in_lng"),
    clockInAccuracyM: numeric("clock_in_accuracy_m"),
    clockOutAt: timestamp("clock_out_at", { withTimezone: true }),
    clockOutLat: numeric("clock_out_lat"),
    clockOutLng: numeric("clock_out_lng"),
    clockOutAccuracyM: numeric("clock_out_accuracy_m"),
    totalHours: numeric("total_hours"),
    patientSignaturePngUrl: text("patient_signature_png_url"),
    patientSignatureSvg: text("patient_signature_svg"),
    patientSignatureAt: timestamp("patient_signature_at", {
      withTimezone: true,
    }),
    patientSignatureIp: text("patient_signature_ip"),
    patientSignedByName: text("patient_signed_by_name"),
  },
  (table) => ({
    uniqueVisitLogDay: unique("visit_log_days_visit_log_day_unique").on(
      table.visitLogId,
      table.dayOfWeek
    ),
  })
);

export const visitLogTasks = pgTable(
  "visit_log_tasks",
  {
    visitLogId: uuid("visit_log_id")
      .notNull()
      .references(() => visitLogs.id, { onDelete: "cascade" }),
    dayOfWeek: text("day_of_week").notNull(), // 'mon'..'sun'
    taskKey: text("task_key").notNull(), // 'tub_shower' | 'bed_bath' | ... | 'other_1' | 'other_2'
    taskLabelCustom: text("task_label_custom"), // only set for 'other_1' / 'other_2'
    checked: boolean("checked").default(false),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.visitLogId, table.dayOfWeek, table.taskKey],
    }),
  })
);
