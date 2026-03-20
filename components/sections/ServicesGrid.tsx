"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bath,
  Pill,
  UtensilsCrossed,
  Sparkles,
  Heart,
  Stethoscope,
  Bandage,
  Droplets,
  Activity,
  Car,
  Coffee,
  Clock,
  ArrowRight,
} from "lucide-react";

const services = [
  { name: "Personal Care", icon: Bath, description: "Bathing, dressing, grooming, and hygiene assistance" },
  { name: "Medication Reminders", icon: Pill, description: "Timely reminders to keep medications on schedule" },
  { name: "Meal Preparation", icon: UtensilsCrossed, description: "Nutritious meal planning and cooking support" },
  { name: "Light Housekeeping", icon: Sparkles, description: "Maintaining a clean and safe living environment" },
  { name: "Companionship", icon: Heart, description: "Friendly conversation, activities, and emotional support" },
  { name: "Skilled Nursing", icon: Stethoscope, description: "Professional RN and LPN clinical care at home" },
  { name: "Wound Care", icon: Bandage, description: "Expert wound assessment, treatment, and monitoring" },
  { name: "IV Therapy", icon: Droplets, description: "Intravenous medication and hydration administration" },
  { name: "Post-Surgical Care", icon: Activity, description: "Recovery support after hospital discharge" },
  { name: "Transportation & Errands", icon: Car, description: "Rides to appointments, grocery runs, and errands" },
  { name: "Respite Care", icon: Coffee, description: "Temporary relief for family caregivers" },
  { name: "24/7 Care", icon: Clock, description: "Around-the-clock home care when you need it most" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function ServicesGrid() {
  return (
    <section className="bg-neutral-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">What We Offer</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-neutral-dark sm:text-4xl">
            Our Home Health Services
          </h2>
          <p className="mt-4 text-neutral-mid">
            From personal care to skilled nursing, we provide a full range of home health
            services to help you or your loved one live comfortably and safely at home.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.name}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-xl border-t-[3px] border-t-transparent bg-white p-6 shadow-sm transition-all duration-300 hover:border-t-primary hover:shadow-lg hover:-translate-y-1.5"
              >
                <div className="mb-3 inline-flex rounded-lg bg-gradient-to-br from-primary-light to-primary-light p-2.5 transition-all duration-300 group-hover:from-primary/15 group-hover:to-accent/15 group-hover:scale-110">
                  <Icon size={22} className="text-primary transition-colors duration-300 group-hover:text-primary-dark" />
                </div>
                <h3 className="font-semibold text-neutral-dark">{service.name}</h3>
                <p className="mt-1 text-sm text-neutral-mid">{service.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-transparent px-8 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
          >
            View All Services
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
