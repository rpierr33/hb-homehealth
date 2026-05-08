import { z } from 'zod/v4';

const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

export const services = [
  "CNA/HHA",
  "RN/LPN",
  "Companion/Sitter",
  "Skilled Nursing",
  "Other",
] as const;

export const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
  service: z.string().optional(),
  serviceNeeded: z.string().optional(),
  message: z.string().optional(),
  preferredContact: z.string().optional(),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  serviceNeeded: z.string().min(1, "Please select a service"),
  message: z.string().optional(),
});

export const referralSchema = z.object({
  referrerName: z.string().min(1, "Referrer name is required"),
  referrerPhone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  referrerEmail: z.email("Please enter a valid email"),
  patientName: z.string().min(1, "Patient name is required"),
  patientPhone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  serviceNeeded: z.string().min(1, "Please select a service"),
  notes: z.string().optional(),
  additionalNotes: z.string().optional(),
});

export const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  position: z.string().optional(),
  positionAppliedFor: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  desiredPayRate: z.string().optional(),
  availableStartDate: z.string().optional(),
  schedulePreference: z.string().optional(),
  authorizedToWork: z.string().optional(),
  felonyConviction: z.string().optional(),
  felonyExplanation: z.string().optional(),
  highestEducation: z.string().optional(),
  schoolName: z.string().optional(),
  certifications: z.string().optional(),
  cprExpiration: z.string().optional(),
  driversLicense: z.string().optional(),
  hasReliableTransport: z.string().optional(),
  employer1Name: z.string().optional(),
  employer1Title: z.string().optional(),
  employer1Dates: z.string().optional(),
  employer1Duties: z.string().optional(),
  employer1ReasonForLeaving: z.string().optional(),
  employer2Name: z.string().optional(),
  employer2Title: z.string().optional(),
  employer2Dates: z.string().optional(),
  employer2Duties: z.string().optional(),
  employer2ReasonForLeaving: z.string().optional(),
  reference1Name: z.string().optional(),
  reference1Phone: z.string().optional(),
  reference1Relationship: z.string().optional(),
  reference2Name: z.string().optional(),
  reference2Phone: z.string().optional(),
  reference2Relationship: z.string().optional(),
  resumeNotes: z.string().optional(),
  additionalInfo: z.string().optional(),
  agreesToTerms: z.union([z.boolean(), z.string()]).optional(),
  message: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
