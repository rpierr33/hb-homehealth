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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { SITE } from "@/lib/site-config";

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
  "Valid CNA, HHA, RN, LPN, or Companion certification (as applicable)",
  "Level 2 Background Screening (AHCA/FBI/FDLE)",
  "CPR / BLS Certification (current)",
  "HIV/AIDS Training Certificate (1 Hour)",
  "OSHA / Infection Control Certificate",
  "Alzheimer's Disease & Related Dementia Training (1 Hour)",
  "Domestic Violence Training (1 Hour)",
  "Medical Errors Prevention Certificate (2 Hours)",
  "Self-Administration of Medication Certificate (2 Hours)",
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

const STEPS = [
  "Personal Info",
  "Position",
  "Education",
  "Work History",
  "References",
  "Review & Submit",
];

const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary";
const labelClass = "block text-sm font-medium text-neutral-dark";

export function CareersContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);
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

  const handleSubmit = async () => {
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
        setError(`Something went wrong. Please try again or call us directly at ${SITE.contact.phone.display}.`);
      }
    } catch {
      setError(`Something went wrong. Please try again or call us directly at ${SITE.contact.phone.display}.`);
    } finally {
      setSubmitting(false);
    }
  };

  const canAdvance = () => {
    switch (step) {
      case 0: return formData.firstName && formData.lastName && formData.email && formData.phone && formData.address && formData.city && formData.zip;
      case 1: return formData.positionAppliedFor && formData.availableStartDate && formData.schedulePreference && formData.authorizedToWork && formData.felonyConviction;
      case 2: return formData.highestEducation && formData.hasReliableTransport;
      case 3: return true; // employment history is optional
      case 4: return formData.reference1Name && formData.reference1Phone && formData.reference1Relationship && formData.reference2Name && formData.reference2Phone && formData.reference2Relationship;
      case 5: return formData.agreesToTerms;
      default: return false;
    }
  };

  const next = () => { if (canAdvance() && step < STEPS.length - 1) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">First Name *</label>
            <input id="firstName" name="firstName" required value={formData.firstName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">Last Name *</label>
            <input id="lastName" name="lastName" required value={formData.lastName} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">Email Address *</label>
            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone Number *</label>
            <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="address">Street Address *</label>
            <input id="address" name="address" required value={formData.address} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="city">City *</label>
            <input id="city" name="city" required value={formData.city} onChange={handleChange} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="state">State *</label>
              <input id="state" name="state" required value={formData.state} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="zip">ZIP Code *</label>
              <input id="zip" name="zip" required value={formData.zip} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>
      );

      case 1: return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="positionAppliedFor">Position Applied For *</label>
            <select id="positionAppliedFor" name="positionAppliedFor" required value={formData.positionAppliedFor} onChange={handleChange} className={inputClass}>
              <option value="">Select a position...</option>
              <option value="CNA">Certified Nursing Assistant (CNA)</option>
              <option value="HHA">Home Health Aide (HHA)</option>
              <option value="RN">Registered Nurse (RN)</option>
              <option value="LPN">Licensed Practical Nurse (LPN)</option>
              <option value="Companion">Companion</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="desiredPayRate">Desired Pay Rate</label>
            <input id="desiredPayRate" name="desiredPayRate" value={formData.desiredPayRate} onChange={handleChange} placeholder="e.g. $18/hr" className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="availableStartDate">Available Start Date *</label>
            <input id="availableStartDate" name="availableStartDate" type="date" required value={formData.availableStartDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="schedulePreference">Schedule Preference *</label>
            <select id="schedulePreference" name="schedulePreference" required value={formData.schedulePreference} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Per Diem">Per Diem</option>
              <option value="Weekends Only">Weekends Only</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="authorizedToWork">Authorized to work in the U.S.? *</label>
            <select id="authorizedToWork" name="authorizedToWork" required value={formData.authorizedToWork} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="felonyConviction">Ever convicted of a felony? *</label>
            <select id="felonyConviction" name="felonyConviction" required value={formData.felonyConviction} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          {formData.felonyConviction === "Yes" && (
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="felonyExplanation">If yes, please explain</label>
              <textarea id="felonyExplanation" name="felonyExplanation" rows={2} value={formData.felonyExplanation} onChange={handleChange} className={inputClass} />
            </div>
          )}
        </div>
      );

      case 2: return (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="highestEducation">Highest Level of Education *</label>
            <select id="highestEducation" name="highestEducation" required value={formData.highestEducation} onChange={handleChange} className={inputClass}>
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
            <label className={labelClass} htmlFor="schoolName">School / Institution Name</label>
            <input id="schoolName" name="schoolName" value={formData.schoolName} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="certifications">Certifications &amp; Licenses</label>
            <textarea id="certifications" name="certifications" rows={2} value={formData.certifications} onChange={handleChange} placeholder="e.g. CNA License #12345, BLS Certification..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="cprExpiration">CPR Certification Expiration</label>
            <input id="cprExpiration" name="cprExpiration" type="date" value={formData.cprExpiration} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="driversLicense">Driver&apos;s License Number</label>
            <input id="driversLicense" name="driversLicense" value={formData.driversLicense} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="hasReliableTransport">Reliable transportation? *</label>
            <select id="hasReliableTransport" name="hasReliableTransport" required value={formData.hasReliableTransport} onChange={handleChange} className={inputClass}>
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      );

      case 3: return (
        <div className="space-y-6">
          <p className="text-sm text-neutral-mid">List your two most recent employers (optional but recommended).</p>
          <div className="rounded-lg bg-neutral-light p-5">
            <p className="mb-3 text-sm font-semibold text-primary">Most Recent Employer</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="employer1Name">Company Name</label><input id="employer1Name" name="employer1Name" value={formData.employer1Name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer1Title">Job Title</label><input id="employer1Title" name="employer1Title" value={formData.employer1Title} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer1Dates">Dates</label><input id="employer1Dates" name="employer1Dates" value={formData.employer1Dates} onChange={handleChange} placeholder="e.g. Jan 2022 - Dec 2024" className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer1ReasonForLeaving">Reason for Leaving</label><input id="employer1ReasonForLeaving" name="employer1ReasonForLeaving" value={formData.employer1ReasonForLeaving} onChange={handleChange} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass} htmlFor="employer1Duties">Key Duties</label><textarea id="employer1Duties" name="employer1Duties" rows={2} value={formData.employer1Duties} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
          <div className="rounded-lg bg-neutral-light p-5">
            <p className="mb-3 text-sm font-semibold text-primary">Previous Employer</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelClass} htmlFor="employer2Name">Company Name</label><input id="employer2Name" name="employer2Name" value={formData.employer2Name} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer2Title">Job Title</label><input id="employer2Title" name="employer2Title" value={formData.employer2Title} onChange={handleChange} className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer2Dates">Dates</label><input id="employer2Dates" name="employer2Dates" value={formData.employer2Dates} onChange={handleChange} placeholder="e.g. Jun 2020 - Dec 2021" className={inputClass} /></div>
              <div><label className={labelClass} htmlFor="employer2ReasonForLeaving">Reason for Leaving</label><input id="employer2ReasonForLeaving" name="employer2ReasonForLeaving" value={formData.employer2ReasonForLeaving} onChange={handleChange} className={inputClass} /></div>
              <div className="sm:col-span-2"><label className={labelClass} htmlFor="employer2Duties">Key Duties</label><textarea id="employer2Duties" name="employer2Duties" rows={2} value={formData.employer2Duties} onChange={handleChange} className={inputClass} /></div>
            </div>
          </div>
        </div>
      );

      case 4: return (
        <div className="space-y-6">
          <p className="text-sm text-neutral-mid">Provide two professional references (not family members).</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className={labelClass} htmlFor="reference1Name">Reference 1 — Name *</label><input id="reference1Name" name="reference1Name" required value={formData.reference1Name} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="reference1Phone">Phone *</label><input id="reference1Phone" name="reference1Phone" type="tel" required value={formData.reference1Phone} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="reference1Relationship">Relationship *</label><input id="reference1Relationship" name="reference1Relationship" required value={formData.reference1Relationship} onChange={handleChange} placeholder="e.g. Former Supervisor" className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="reference2Name">Reference 2 — Name *</label><input id="reference2Name" name="reference2Name" required value={formData.reference2Name} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="reference2Phone">Phone *</label><input id="reference2Phone" name="reference2Phone" type="tel" required value={formData.reference2Phone} onChange={handleChange} className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="reference2Relationship">Relationship *</label><input id="reference2Relationship" name="reference2Relationship" required value={formData.reference2Relationship} onChange={handleChange} placeholder="e.g. Coworker" className={inputClass} /></div>
          </div>
          <div className="grid gap-4">
            <div><label className={labelClass} htmlFor="resumeNotes">Resume Link or Notes</label><input id="resumeNotes" name="resumeNotes" value={formData.resumeNotes} onChange={handleChange} placeholder="Paste a link to your resume or relevant notes..." className={inputClass} /></div>
            <div><label className={labelClass} htmlFor="additionalInfo">Anything else you&apos;d like us to know?</label><textarea id="additionalInfo" name="additionalInfo" rows={3} value={formData.additionalInfo} onChange={handleChange} placeholder="Tell us about your experience, skills, or why you'd like to join our team..." className={inputClass} /></div>
          </div>
        </div>
      );

      case 5: return (
        <div className="space-y-6">
          <p className="text-sm text-neutral-mid">Please review your information before submitting.</p>
          <div className="space-y-4">
            {[
              { title: "Personal Info", items: [`${formData.firstName} ${formData.lastName}`, formData.email, formData.phone, `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`] },
              { title: "Position", items: [formData.positionAppliedFor, `Start: ${formData.availableStartDate}`, formData.schedulePreference, `Pay: ${formData.desiredPayRate || "Not specified"}`] },
              { title: "Education", items: [formData.highestEducation, formData.schoolName, formData.certifications].filter(Boolean) },
              { title: "Work History", items: [formData.employer1Name ? `${formData.employer1Title} at ${formData.employer1Name}` : "Not provided", formData.employer2Name ? `${formData.employer2Title} at ${formData.employer2Name}` : ""].filter(Boolean) },
              { title: "References", items: [`${formData.reference1Name} (${formData.reference1Relationship})`, `${formData.reference2Name} (${formData.reference2Relationship})`] },
            ].map((section) => (
              <div key={section.title} className="rounded-lg bg-neutral-light p-4">
                <p className="text-sm font-semibold text-primary mb-1">{section.title}</p>
                {section.items.map((item, i) => (
                  <p key={i} className="text-sm text-neutral-dark">{item}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-gray-200 bg-neutral-light p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreesToTerms"
                checked={formData.agreesToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-dark leading-relaxed">
                I certify that the information provided in this application is true and complete to the best of my knowledge. I understand that any misrepresentation or omission may be grounds for rejection of my application or termination of employment. I authorize Humanity &amp; Blessings Home Health to verify the information provided and to contact references. *
              </span>
            </label>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
                Join Our Team
              </h1>
              <p className="mt-4 text-lg text-neutral-mid">
                Humanity &amp; Blessings Home Health is looking for compassionate,
                skilled healthcare professionals to join our growing family. Help
                us improve lives together.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/nurse-patient-v3.jpg"
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
              We are currently hiring for the following roles in Broward County, Florida.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {openPositions.map((position) => {
              const Icon = position.icon;
              return (
                <div key={position.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="mb-3 inline-flex rounded-lg bg-primary-light p-2.5">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-neutral-dark">{position.title}</h3>
                  <p className="mt-2 text-sm text-neutral-mid">{position.description}</p>
                </div>
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
              <h2 className="font-display text-3xl font-bold text-neutral-dark">Requirements</h2>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                All applicants must meet the following requirements to be considered for employment.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <ul className="space-y-3">
                {requirements.map((req) => (
                  <li key={req} className="flex items-center gap-3">
                    <div className="shrink-0 rounded-full bg-secondary-light p-1.5">
                      <ShieldCheck size={14} className="text-secondary" />
                    </div>
                    <span className="text-neutral-dark">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Step Application Form */}
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
                Thank you for your interest in joining our team. We&apos;ll review your application and be in touch soon.
              </p>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              {/* Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary-light p-2.5">
                  <Briefcase size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-neutral-dark">Employment Application</h2>
                  <p className="text-sm text-neutral-mid">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => { if (i < step) setStep(i); }}
                      className={`text-xs font-medium transition-colors hidden sm:block ${
                        i === step ? "text-primary" : i < step ? "text-secondary cursor-pointer hover:text-secondary/80" : "text-gray-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
                    style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">
                {renderStep()}
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              {/* Navigation */}
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prev}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-neutral-mid transition-all hover:border-gray-300 hover:text-neutral-dark disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                {step < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    disabled={!canAdvance()}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !formData.agreesToTerms}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-dark hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
