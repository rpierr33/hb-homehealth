"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";

const resources = [
  {
    name: "Centers for Medicare & Medicaid Services (CMS)",
    description:
      "The federal agency that administers Medicare, Medicaid, the Children's Health Insurance Program (CHIP), and the Health Insurance Marketplace.",
    url: "https://www.cms.gov",
  },
  {
    name: "National Institutes of Health",
    description:
      "The nation's medical research agency, providing health information and the latest research findings to improve public health.",
    url: "https://www.health.nih.gov",
  },
  {
    name: "Medicare",
    description:
      "The official U.S. government site for Medicare. Find information about eligibility, enrollment, benefits, and coverage options.",
    url: "https://www.medicare.gov",
  },
];

export function ResourcesContent() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
              Resources
            </h1>
            <p className="mt-4 text-lg text-neutral-mid">
              Helpful links and resources for home health care information
              and Medicare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Resources List */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
              >
                <div className="shrink-0 rounded-xl bg-accent-light p-3">
                  <BookOpen size={24} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-neutral-dark group-hover:text-primary transition-colors">
                      {resource.name}
                    </h2>
                    <ExternalLink
                      size={16}
                      className="text-neutral-mid opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-1 text-neutral-mid">{resource.description}</p>
                  <p className="mt-2 text-sm text-primary">{resource.url}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl bg-primary-light p-8 text-center"
          >
            <h2 className="font-display text-2xl font-bold text-neutral-dark">
              Have Questions?
            </h2>
            <p className="mt-3 text-neutral-mid">
              If you have questions about home health care services, eligibility,
              or how to get started, our team is here to help. Contact us at{" "}
              <a
                href="tel:9545550123"
                className="font-semibold text-primary hover:underline"
              >
                (954) 555-0123
              </a>{" "}
              or email{" "}
              <a
                href="mailto:support@humanityandblessings.com"
                className="font-semibold text-primary hover:underline"
              >
                support@humanityandblessings.com
              </a>
              .
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
