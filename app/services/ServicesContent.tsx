"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Stethoscope,
  Users,
  Phone,
  ShieldCheck,
  Bath,
  Pill,
  Utensils,
  Home,
  HandHelping,
  Syringe,
  Activity,
} from "lucide-react";

const hhaServices = [
  "Bathing",
  "Dressing",
  "Toileting",
  "Feeding",
  "Errands",
  "Ambulating",
  "Meal Preparations",
  "Light Housekeeping",
  "Medication Reminders",
];

const skilledServices = [
  "Tube Feedings",
  "Wound Care",
  "Ventilators",
  "Infusion Therapy (IV)",
  "Post-Surgical Care",
];

export function ServicesContent() {
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
                Our Services
              </h1>
              <p className="mt-4 text-lg text-neutral-mid">
                Humanity &amp; Blessings Home Health provides comprehensive home health care
                and healthcare staffing services throughout Broward County, Florida.
                Our highly skilled specialists deliver excellent care right in the
                comfort of your home.
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
                  src="/images/services-assist.jpg"
                  alt="Caregiver smiling and talking to elderly woman"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HHAs / CNAs */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <div>
                <div className="mb-4 inline-flex rounded-xl bg-primary-light p-3">
                  <Heart size={28} className="text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold text-neutral-dark">
                  Home Health Aides (HHAs) &amp; Certified Nursing Assistants (CNAs)
                </h2>
                <p className="mt-4 text-neutral-mid leading-relaxed">
                  Our HHAs and CNAs provide compassionate, hands-on personal care
                  assistance to help clients maintain their independence and dignity
                  in the comfort of their own homes. These dedicated professionals
                  are trained to assist with daily living activities and provide
                  essential support for individuals who need help with routine tasks.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-neutral-dark">
                  Services Include:
                </h3>
                <ul className="space-y-3">
                  {hhaServices.map((service, index) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0 rounded-full bg-secondary-light p-1.5">
                        <ShieldCheck size={14} className="text-secondary" />
                      </div>
                      <span className="text-neutral-dark">{service}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RNs / LPNs */}
      <section className="bg-neutral-light py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <div className="order-2 lg:order-1 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-neutral-dark">
                  Services Include:
                </h3>
                <ul className="space-y-3">
                  {skilledServices.map((service, index) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="shrink-0 rounded-full bg-accent-light p-1.5">
                        <Stethoscope size={14} className="text-accent" />
                      </div>
                      <span className="text-neutral-dark">{service}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="order-1 lg:order-2">
                <div className="mb-4 inline-flex rounded-xl bg-accent-light p-3">
                  <Syringe size={28} className="text-accent" />
                </div>
                <h2 className="font-display text-3xl font-bold text-neutral-dark">
                  Registered Nurses (RNs) &amp; Licensed Practical Nurses (LPNs)
                </h2>
                <p className="mt-4 text-neutral-mid leading-relaxed">
                  Our skilled nursing professionals provide advanced medical care
                  in the home setting. RNs and LPNs deliver specialized treatments
                  and clinical services that require professional nursing expertise,
                  ensuring patients receive hospital-quality care in the comfort of
                  their homes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Companions & Sitters */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto mb-4 inline-flex rounded-xl bg-secondary-light p-3">
              <Users size={28} className="text-secondary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-neutral-dark">
              Companions &amp; Sitters
            </h2>
            <p className="mt-4 text-neutral-mid leading-relaxed">
              Our companion and sitter services provide meaningful social
              interaction, supervision, and emotional support for individuals who
              may feel isolated or need someone to be present for safety and
              comfort. Companions engage clients in conversation, accompany them
              on outings, and provide a reassuring presence throughout the day or
              night.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: HandHelping,
                title: "Companionship",
                description:
                  "Meaningful social interaction, conversation, and emotional support to reduce isolation.",
              },
              {
                icon: Activity,
                title: "Safety Supervision",
                description:
                  "Attentive monitoring and presence to ensure client safety and well-being around the clock.",
              },
              {
                icon: Home,
                title: "Daily Activity Support",
                description:
                  "Assistance with light activities, outings, and maintaining a comfortable home environment.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-secondary-light p-2.5">
                    <Icon size={22} className="text-secondary" />
                  </div>
                  <h3 className="font-semibold text-neutral-dark">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-mid">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-primary-light">
            Contact us today to learn how our home health care services can help
            you or your loved one. We serve all of Broward County, Florida.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:bg-neutral-light hover:shadow-lg"
            >
              <Phone size={20} />
              Contact Us
            </Link>
            <Link
              href="/referrals"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-primary"
            >
              Make a Referral
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
