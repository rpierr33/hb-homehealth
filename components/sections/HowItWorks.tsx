"use client";

import { motion } from "framer-motion";
import { Phone, ClipboardCheck, HeartHandshake } from "lucide-react";

const steps = [
  {
    icon: Phone,
    title: "Contact Us",
    description:
      "Reach out by phone or through our online form. We'll listen to your needs and answer any questions about our home health services.",
    step: "01",
  },
  {
    icon: ClipboardCheck,
    title: "Care Assessment",
    description:
      "Our team will evaluate your care needs and develop a personalized care plan tailored to you or your loved one's specific requirements.",
    step: "02",
  },
  {
    icon: HeartHandshake,
    title: "Start Care",
    description:
      "Your matched caregiver begins providing compassionate, professional care in the comfort of your own home.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple Process</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-neutral-dark sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-neutral-mid">
            Getting started is easy. We&apos;re with you every step of the way.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          {/* Connecting dashed line between steps — hidden on mobile */}
          <div className="pointer-events-none absolute top-10 left-0 right-0 hidden md:block">
            <div className="mx-auto flex max-w-3xl items-center justify-center px-20">
              <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" style={{ backgroundImage: "repeating-linear-gradient(90deg, #E8476C 0px, #E8476C 8px, transparent 8px, transparent 16px)" }} />
            </div>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="group relative rounded-2xl bg-white p-8 text-center transition-all duration-300 hover:bg-primary-light/30 hover:shadow-lg"
              >
                {/* Numbered step badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-xs font-bold text-white shadow-md shadow-primary/30">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-accent-light transition-transform duration-300 group-hover:scale-110">
                  <Icon
                    size={32}
                    className="text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5"
                  />
                </div>

                <h3 className="text-xl font-bold text-neutral-dark">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-neutral-mid">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
