"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceNeeded: string;
  message: string;
}

export function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    serviceNeeded: "",
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
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again or call us directly.");
      }
    } catch {
      setError("Something went wrong. Please try again or call us directly.");
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
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-neutral-mid">
              We&apos;re here to help. Reach out to us and we&apos;ll respond
              within 1 business day.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-bold text-neutral-dark">
                Get in Touch
              </h2>
              <p className="mt-2 text-neutral-mid">
                Have questions about our home health care services? We&apos;d
                love to hear from you.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary-light p-2.5">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">
                      Office Address
                    </p>
                    <p className="text-neutral-mid">
                      Oakland Park, FL 33334
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary-light p-2.5">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">Phone</p>
                    <a
                      href="tel:9545550123"
                      className="text-primary hover:text-primary-dark"
                    >
                      (954) 555-0123
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary-light p-2.5">
                    <Mail size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">Email</p>
                    <a
                      href="mailto:support@humanityandblessings.com"
                      className="text-primary hover:text-primary-dark"
                    >
                      support@humanityandblessings.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary-light p-2.5">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">
                      Hours of Operation
                    </p>
                    <p className="text-neutral-mid">
                      Mon&ndash;Fri: 9:00 AM &ndash; 5:00 PM
                      <br />
                      Saturday: Upon Request
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mt-8 overflow-hidden rounded-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14311.0!2d-80.15!3d26.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d904e1e35e8c9d%3A0x7a8e1c5d5b8c5b5b!2sOakland+Park%2C+FL+33334!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Humanity & Blessings Home Health - Oakland Park, FL"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl bg-accent-light p-12 text-center"
                >
                  <CheckCircle size={48} className="text-accent" />
                  <h3 className="mt-4 font-display text-2xl font-bold text-neutral-dark">
                    Message Sent!
                  </h3>
                  <p className="mt-2 text-neutral-mid">
                    Thank you for reaching out. We&apos;ll get back to you
                    within 1 business day.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                >
                  <h2 className="font-display text-2xl font-bold text-neutral-dark">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-sm text-neutral-mid">
                    Fields marked with * are required.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        className="block text-sm font-medium text-neutral-dark"
                        htmlFor="firstName"
                      >
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-neutral-dark"
                        htmlFor="lastName"
                      >
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
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
                        placeholder="Tell us how we can help..."
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="mt-4 text-sm text-red-500">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary-dark disabled:opacity-50"
                  >
                    <Send size={18} />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
