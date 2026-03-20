import { z } from 'zod/v4';

const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

export const services = [
  "CNA/HHA",
  "RN/LPN",
  "Companion/Sitter",
  "Skilled Nursing",
  "Other",
] as const;

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
});

export const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email"),
  phone: z.string().regex(phoneRegex, "Please enter a valid phone number"),
  position: z.string().min(1, "Please select a position"),
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ReferralFormData = z.infer<typeof referralSchema>;
export type ApplicationFormData = z.infer<typeof applicationSchema>;
