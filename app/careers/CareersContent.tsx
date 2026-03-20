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
  name: string;
  email: string;
  phone: string;
  positionAppliedFor: string;
  resumeNotes: string;
  message: string;
}

export function CareersContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: "",
    email: "",
    phone: "",
    positionAppliedFor: "",
    resumeNotes: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary-light p-2.5">
                  <Briefcase size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-neutral-dark">
                    Apply Now
                  </h2>
                  <p className="text-sm text-neutral-mid">
                    Fields marked with * are required.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="name"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="email"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="phone"
                  >
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="positionAppliedFor"
                  >
                    Position Applied For *
                  </label>
                  <select
                    id="positionAppliedFor"
                    name="positionAppliedFor"
                    required
                    value={formData.positionAppliedFor}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Select a position...</option>
                    <option value="CNA">
                      Certified Nursing Assistant (CNA)
                    </option>
                    <option value="HHA">Home Health Aide (HHA)</option>
                    <option value="RN">Registered Nurse (RN)</option>
                    <option value="LPN">Licensed Practical Nurse (LPN)</option>
                    <option value="Companion">Companion</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="resumeNotes"
                  >
                    Resume Link or Notes
                  </label>
                  <input
                    id="resumeNotes"
                    name="resumeNotes"
                    value={formData.resumeNotes}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Paste a link to your resume or relevant notes..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-neutral-dark"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Tell us about your experience and why you'd like to join our team..."
                  />
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                <Send size={18} />
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
