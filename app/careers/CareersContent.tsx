"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Send,
  CheckCircle,
  Briefcase,
  ShieldCheck,
  Heart,
  Stethoscope,
  Users,
  ClipboardList,
} from "lucide-react";

const openPositions = [
  {
    title: "Certified Nursing Assistant (CNA)",
    icon: Heart,
    description:
      "Provide hands-on personal care assistance to clients in their homes, including bathing, dressing, feeding, and mobility support.",
  },
  {
    title: "Home Health Aide (HHA)",
    icon: Heart,
    description:
      "Assist clients with daily living activities, meal preparation, light housekeeping, and medication reminders.",
  },
  {
    title: "Registered Nurse (RN)",
    icon: Stethoscope,
    description:
      "Deliver skilled nursing care including wound care, IV therapy, ventilator management, and post-surgical care in home settings.",
  },
  {
    title: "Licensed Practical Nurse (LPN)",
    icon: Stethoscope,
    description:
      "Provide clinical nursing services under RN supervision, including tube feedings, medication administration, and patient assessments.",
  },
  {
    title: "Companion",
    icon: Users,
    description:
      "Offer meaningful companionship, social interaction, and emotional support to clients who need a caring presence.",
  },
];

const requirements = [
  "Level 2 Background Screening on File with AHCA",
  "Valid CPR Card Through American Heart Association, American Red Cross, or American Health and Safety Institute",
  'Physical Exam Done Within the Last 6 Months Stating "Free of Communicable Diseases"',
  "HIV/AIDS Certificate (1 Hour)",
  "Alzheimer's Training Certificate (1 Hour)",
  "Self-Administration of Medication Certificate (2 Hours)",
  "Professional Liability Insurance (Recommended)",
  "Driver's License",
  "Social Security Card",
  "Current Automobile Insurance and Vehicle Registration",
];

interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  positionAppliedFor: string;
  desiredPayRate: string;
  availableStartDate: string;
  schedulePreference: string;
  authorizedToWork: string;
  felonyConviction: string;
  felonyExplanation: string;
  highestEducation: string;
  schoolName: string;
  certifications: string;
  cprExpiration: string;
  driversLicense: string;
  hasReliableTransport: string;
  employer1Name: string;
  employer1Title: string;
  employer1Dates: string;
  employer1Duties: string;
  employer1ReasonForLeaving: string;
  employer2Name: string;
  employer2Title: string;
  employer2Dates: string;
  employer2Duties: string;
  employer2ReasonForLeaving: string;
  reference1Name: string;
  reference1Phone: string;
  reference1Relationship: string;
  reference2Name: string;
  reference2Phone: string;
  reference2Relationship: string;
  resumeNotes: string;
  additionalInfo: string;
  agreesToTerms: boolean;
}

export function CareersContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ApplicationFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "FL",
    zip: "",
    positionAppliedFor: "",
    desiredPayRate: "",
    availableStartDate: "",
    schedulePreference: "",
    authorizedToWork: "",
    felonyConviction: "",
    felonyExplanation: "",
    highestEducation: "",
    schoolName: "",
    certifications: "",
    cprExpiration: "",
    driversLicense: "",
    hasReliableTransport: "",
    employer1Name: "",
    employer1Title: "",
    employer1Dates: "",
    employer1Duties: "",
    employer1ReasonForLeaving: "",
    employer2Name: "",
    employer2Title: "",
    employer2Dates: "",
    employer2Duties: "",
    employer2ReasonForLeaving: "",
    reference1Name: "",
    reference1Phone: "",
    reference1Relationship: "",
    reference2Name: "",
    reference2Phone: "",
    reference2Relationship: "",
    resumeNotes: "",
    additionalInfo: "",
    agreesToTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or call us directly at (954) 555-0123.");
      }
    } catch {
      setError("Something went wrong. Please try again or call us directly at (954) 555-0123.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
                Join Our Team
              </h1>
              <p className="mt-4 text-lg text-neutral-mid">
                Humanity &amp; Blessings Home Health is looking for compassionate,
                skilled healthcare professionals to join our growing family. Help
                us improve lives together.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/nurse-patient.jpg"
                  alt="Nurse caring for patient"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-neutral-dark sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-4 text-neutral-mid">
              We are currently hiring for the following roles in Broward County,
              Florida.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {openPositions.map((position, index) => {
              const Icon = position.icon;
              return (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-3 inline-flex rounded-lg bg-primary-light p-2.5">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-neutral-dark">
                    {position.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-mid">
                    {position.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-neutral-light py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-xl bg-accent-light p-3">
                <ClipboardList size={28} className="text-accent" />
              </div>
              <h2 className="font-display text-3xl font-bold text-neutral-dark">
                Requirements
              </h2>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                All applicants must meet the following requirements to be
                considered for employment with Humanity &amp; Blessings Home
                Health. These are standard Florida home health care industry
                requirements.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <ul className="space-y-3">
                {requirements.map((req, index) => (
                  <motion.li
                    key={req}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="flex items-center gap-3"
                  >
                    <div className="shrink-0 rounded-full bg-secondary-light p-1.5">
                      <ShieldCheck size={14} className="text-secondary" />
                    </div>
                    <span className="text-neutral-dark">{req}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-accent-light p-12 text-center"
            >
              <CheckCircle size={48} className="text-accent" />
              <h3 className="mt-4 font-display text-2xl font-bold text-neutral-dark">
                Application Submitted!
              </h3>
              <p className="mt-2 text-neutral-mid">
                Thank you for your interest in joining our team. We&apos;ll
                review your application and be in touch soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-primary-light p-2.5">
                  <Briefcase size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-neutral-dark">
                    Employment Application
                  </h2>
                  <p className="text-sm text-neutral-mid">
                    Fields marked with * are required.
                  </p>
                </div>
              </div>

              {/* Section 1: Personal Information */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Personal Information
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="firstName">First Name *</label>
                    <input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="lastName">Last Name *</label>
                    <input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="phone">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="address">Street Address *</label>
                    <input id="address" name="address" required value={formData.address} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="city">City *</label>
                    <input id="city" name="city" required value={formData.city} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="state">State *</label>
                      <input id="state" name="state" required value={formData.state} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="zip">ZIP Code *</label>
                      <input id="zip" name="zip" required value={formData.zip} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Section 2: Position & Availability */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Position &amp; Availability
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="positionAppliedFor">Position Applied For *</label>
                    <select id="positionAppliedFor" name="positionAppliedFor" required value={formData.positionAppliedFor} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select a position...</option>
                      <option value="CNA">Certified Nursing Assistant (CNA)</option>
                      <option value="HHA">Home Health Aide (HHA)</option>
                      <option value="RN">Registered Nurse (RN)</option>
                      <option value="LPN">Licensed Practical Nurse (LPN)</option>
                      <option value="Companion">Companion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="desiredPayRate">Desired Pay Rate</label>
                    <input id="desiredPayRate" name="desiredPayRate" value={formData.desiredPayRate} onChange={handleChange} placeholder="e.g. $18/hr" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="availableStartDate">Available Start Date *</label>
                    <input id="availableStartDate" name="availableStartDate" type="date" required value={formData.availableStartDate} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="schedulePreference">Schedule Preference *</label>
                    <select id="schedulePreference" name="schedulePreference" required value={formData.schedulePreference} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Per Diem">Per Diem</option>
                      <option value="Weekends Only">Weekends Only</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="authorizedToWork">Are you authorized to work in the U.S.? *</label>
                    <select id="authorizedToWork" name="authorizedToWork" required value={formData.authorizedToWork} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="felonyConviction">Have you ever been convicted of a felony? *</label>
                    <select id="felonyConviction" name="felonyConviction" required value={formData.felonyConviction} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  {formData.felonyConviction === "Yes" && (
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="felonyExplanation">If yes, please explain</label>
                      <textarea id="felonyExplanation" name="felonyExplanation" rows={2} value={formData.felonyExplanation} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Section 3: Education & Certifications */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Education &amp; Certifications
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="highestEducation">Highest Level of Education *</label>
                    <select id="highestEducation" name="highestEducation" required value={formData.highestEducation} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="High School Diploma / GED">High School Diploma / GED</option>
                      <option value="Some College">Some College</option>
                      <option value="Associate Degree">Associate Degree</option>
                      <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
                      <option value="Master's Degree">Master&apos;s Degree</option>
                      <option value="Doctoral Degree">Doctoral Degree</option>
                      <option value="Vocational / Trade School">Vocational / Trade School</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="schoolName">School / Institution Name</label>
                    <input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="certifications">Certifications &amp; Licenses (list all, separated by commas)</label>
                    <textarea id="certifications" name="certifications" rows={2} value={formData.certifications} onChange={handleChange} placeholder="e.g. CNA License #12345, BLS Certification, HIV/AIDS Certificate..." className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="cprExpiration">CPR Certification Expiration Date</label>
                    <input id="cprExpiration" name="cprExpiration" type="date" value={formData.cprExpiration} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="driversLicense">Driver&apos;s License Number</label>
                    <input id="driversLicense" name="driversLicense" value={formData.driversLicense} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="hasReliableTransport">Do you have reliable transportation? *</label>
                    <select id="hasReliableTransport" name="hasReliableTransport" required value={formData.hasReliableTransport} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Section 4: Employment History */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Employment History
                </legend>
                <p className="mb-4 text-sm text-neutral-mid">Please list your two most recent employers.</p>

                {/* Employer 1 */}
                <div className="mb-6 rounded-lg bg-neutral-light p-5">
                  <p className="mb-3 text-sm font-semibold text-primary">Most Recent Employer</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer1Name">Employer / Company Name</label>
                      <input id="employer1Name" name="employer1Name" value={formData.employer1Name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer1Title">Job Title</label>
                      <input id="employer1Title" name="employer1Title" value={formData.employer1Title} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer1Dates">Dates of Employment</label>
                      <input id="employer1Dates" name="employer1Dates" value={formData.employer1Dates} onChange={handleChange} placeholder="e.g. Jan 2022 - Dec 2024" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer1ReasonForLeaving">Reason for Leaving</label>
                      <input id="employer1ReasonForLeaving" name="employer1ReasonForLeaving" value={formData.employer1ReasonForLeaving} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer1Duties">Key Duties &amp; Responsibilities</label>
                      <textarea id="employer1Duties" name="employer1Duties" rows={2} value={formData.employer1Duties} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                </div>

                {/* Employer 2 */}
                <div className="rounded-lg bg-neutral-light p-5">
                  <p className="mb-3 text-sm font-semibold text-primary">Previous Employer</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer2Name">Employer / Company Name</label>
                      <input id="employer2Name" name="employer2Name" value={formData.employer2Name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer2Title">Job Title</label>
                      <input id="employer2Title" name="employer2Title" value={formData.employer2Title} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer2Dates">Dates of Employment</label>
                      <input id="employer2Dates" name="employer2Dates" value={formData.employer2Dates} onChange={handleChange} placeholder="e.g. Jun 2020 - Dec 2021" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer2ReasonForLeaving">Reason for Leaving</label>
                      <input id="employer2ReasonForLeaving" name="employer2ReasonForLeaving" value={formData.employer2ReasonForLeaving} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-neutral-dark" htmlFor="employer2Duties">Key Duties &amp; Responsibilities</label>
                      <textarea id="employer2Duties" name="employer2Duties" rows={2} value={formData.employer2Duties} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Section 5: References */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Professional References
                </legend>
                <p className="mb-4 text-sm text-neutral-mid">Please provide two professional references (not family members).</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference1Name">Reference 1 — Name *</label>
                    <input id="reference1Name" name="reference1Name" required value={formData.reference1Name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference1Phone">Phone *</label>
                    <input id="reference1Phone" name="reference1Phone" type="tel" required value={formData.reference1Phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference1Relationship">Relationship *</label>
                    <input id="reference1Relationship" name="reference1Relationship" required value={formData.reference1Relationship} onChange={handleChange} placeholder="e.g. Former Supervisor" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference2Name">Reference 2 — Name *</label>
                    <input id="reference2Name" name="reference2Name" required value={formData.reference2Name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference2Phone">Phone *</label>
                    <input id="reference2Phone" name="reference2Phone" type="tel" required value={formData.reference2Phone} onChange={handleChange} className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="reference2Relationship">Relationship *</label>
                    <input id="reference2Relationship" name="reference2Relationship" required value={formData.reference2Relationship} onChange={handleChange} placeholder="e.g. Coworker" className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </fieldset>

              {/* Section 6: Additional Information */}
              <fieldset className="mb-8">
                <legend className="mb-4 text-lg font-bold text-neutral-dark border-b border-gray-200 pb-2 w-full">
                  Additional Information
                </legend>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="resumeNotes">Resume Link or Notes</label>
                    <input id="resumeNotes" name="resumeNotes" value={formData.resumeNotes} onChange={handleChange} placeholder="Paste a link to your resume or relevant notes..." className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark" htmlFor="additionalInfo">Anything else you&apos;d like us to know?</label>
                    <textarea id="additionalInfo" name="additionalInfo" rows={4} value={formData.additionalInfo} onChange={handleChange} placeholder="Tell us about your experience, skills, or why you'd like to join our team..." className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
              </fieldset>

              {/* Agreement */}
              <div className="mb-6 rounded-lg border border-gray-200 bg-neutral-light p-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreesToTerms"
                    required
                    checked={formData.agreesToTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-neutral-dark leading-relaxed">
                    I certify that the information provided in this application is true and complete to the best of my knowledge. I understand that any misrepresentation or omission may be grounds for rejection of my application or termination of employment. I authorize Humanity &amp; Blessings Home Health to verify the information provided and to contact references. *
                  </span>
                </label>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50"
              >
                <Send size={18} />
                {submitting ? "Submitting Application..." : "Submit Application"}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
