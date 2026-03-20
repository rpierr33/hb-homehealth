"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, Phone, UserPlus } from "lucide-react";

interface ReferralFormData {
  referrerName: string;
  referrerPhone: string;
  referrerEmail: string;
  patientName: string;
  patientPhone: string;
  serviceNeeded: string;
  additionalNotes: string;
}

export function ReferralsContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ReferralFormData>({
    referrerName: "",
    referrerPhone: "",
    referrerEmail: "",
    patientName: "",
    patientPhone: "",
    serviceNeeded: "",
    additionalNotes: "",
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
      const res = await fetch("/api/referrals", {
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
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
              Make a Referral
            </h1>
            <p className="mt-4 text-lg text-neutral-mid">
              Refer a patient or loved one to Humanity &amp; Blessings Home
              Health. We&apos;ll follow up promptly to coordinate care.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Quick contact */}
          <div className="mb-12 flex flex-col items-center gap-4 rounded-2xl bg-accent-light p-8 text-center sm:flex-row sm:text-left">
            <div className="shrink-0 rounded-xl bg-accent p-3">
              <Phone size={24} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-dark">
                Need to make a referral by phone?
              </h2>
              <p className="text-neutral-mid">
                Call us at{" "}
                <a
                  href="tel:9545550123"
                  className="font-semibold text-accent hover:underline"
                >
                  (954) 555-0123
                </a>{" "}
                during business hours (Mon&ndash;Fri, 9 AM &ndash; 5 PM).
              </p>
            </div>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center rounded-2xl bg-accent-light p-12 text-center"
            >
              <CheckCircle size={48} className="text-accent" />
              <h3 className="mt-4 font-display text-2xl font-bold text-neutral-dark">
                Referral Submitted!
              </h3>
              <p className="mt-2 text-neutral-mid">
                Thank you for your referral. Our team will review the
                information and follow up within 1 business day.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary-light p-2.5">
                  <UserPlus size={22} className="text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-neutral-dark">
                    Referral Form
                  </h2>
                  <p className="text-sm text-neutral-mid">
                    Fields marked with * are required.
                  </p>
                </div>
              </div>

              {/* Referrer Info */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Referrer Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="referrerName"
                    >
                      Referrer Name *
                    </label>
                    <input
                      id="referrerName"
                      name="referrerName"
                      required
                      value={formData.referrerName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="referrerPhone"
                    >
                      Referrer Phone *
                    </label>
                    <input
                      id="referrerPhone"
                      name="referrerPhone"
                      type="tel"
                      required
                      value={formData.referrerPhone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="referrerEmail"
                    >
                      Referrer Email *
                    </label>
                    <input
                      id="referrerEmail"
                      name="referrerEmail"
                      type="email"
                      required
                      value={formData.referrerEmail}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
                  Patient Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="patientName"
                    >
                      Patient Name *
                    </label>
                    <input
                      id="patientName"
                      name="patientName"
                      required
                      value={formData.patientName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="patientPhone"
                    >
                      Patient Phone
                    </label>
                    <input
                      id="patientPhone"
                      name="patientPhone"
                      type="tel"
                      value={formData.patientPhone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="serviceNeeded"
                    >
                      Service Needed *
                    </label>
                    <select
                      id="serviceNeeded"
                      name="serviceNeeded"
                      required
                      value={formData.serviceNeeded}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Select a service...</option>
                      <option value="CNA/HHA">CNA / HHA</option>
                      <option value="RN/LPN">RN / LPN</option>
                      <option value="Companion/Sitter">
                        Companion / Sitter
                      </option>
                      <option value="Skilled Nursing">Skilled Nursing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      className="block text-sm font-medium text-neutral-dark"
                      htmlFor="additionalNotes"
                    >
                      Additional Notes
                    </label>
                    <textarea
                      id="additionalNotes"
                      name="additionalNotes"
                      rows={4}
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Any additional details about the patient's needs..."
                    />
                  </div>
                </div>
              </div>

              {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
              >
                <Send size={18} />
                {submitting ? "Submitting..." : "Submit Referral"}
              </button>
            </motion.form>
          )}
        </div>
      </section>
    </>
  );
}
