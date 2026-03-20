"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Phone,
  Heart,
  CheckCircle,
  MapPin,
  Shield,
  Clock,
  HandHeart,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const badgePulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const floatAnimation = (delay: number, x: number, y: number) => ({
  initial: { x: 0, y: 0 },
  animate: {
    x: [0, x, 0],
    y: [0, y, 0],
    transition: {
      duration: 8 + delay,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay,
    },
  },
});

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Layered gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-light via-white to-white" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent-light/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-secondary-light/20" />

      {/* Floating decorative gradient circles */}
      <motion.div
        {...floatAnimation(0, 30, -20)}
        className="pointer-events-none absolute -top-20 left-[15%] h-72 w-72 rounded-full bg-gradient-to-br from-primary/8 to-accent/5 blur-3xl"
      />
      <motion.div
        {...floatAnimation(2, -25, 15)}
        className="pointer-events-none absolute top-1/3 right-[10%] h-56 w-56 rounded-full bg-gradient-to-bl from-secondary/8 to-primary/5 blur-3xl"
      />
      <motion.div
        {...floatAnimation(1, 20, 25)}
        className="pointer-events-none absolute -bottom-10 left-[30%] h-64 w-64 rounded-full bg-gradient-to-tr from-accent/6 to-primary-light/10 blur-3xl"
      />
      <motion.div
        {...floatAnimation(3, -15, -18)}
        className="pointer-events-none absolute top-10 right-[35%] h-40 w-40 rounded-full bg-gradient-to-br from-primary-light/20 to-transparent blur-2xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          {/* Badges with pulse */}
          <motion.div
            variants={childVariants}
            className="mb-8 flex flex-wrap items-center gap-3"
          >
            <motion.span
              variants={badgePulse}
              initial="initial"
              animate="animate"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-4 py-1.5 text-xs font-semibold text-accent shadow-sm"
            >
              <CheckCircle size={14} />
              Accepting New Clients
            </motion.span>
            <motion.span
              variants={badgePulse}
              initial="initial"
              animate="animate"
              style={{ animationDelay: "0.5s" }}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary-light px-4 py-1.5 text-xs font-semibold text-secondary shadow-sm"
            >
              <MapPin size={14} />
              Serving Broward County
            </motion.span>
          </motion.div>

          {/* Heading with gradient text */}
          <motion.h1
            variants={childVariants}
            className="font-display text-4xl font-bold tracking-tight text-neutral-dark sm:text-5xl lg:text-6xl"
          >
            Improving Lives{" "}
            <span className="bg-gradient-to-r from-primary via-primary-dark to-accent bg-clip-text text-transparent">
              Together
            </span>
          </motion.h1>

          <motion.p
            variants={childVariants}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-mid sm:text-xl"
          >
            Each member of our care team works together to help you maintain the
            quality of life you deserve.
          </motion.p>

          {/* CTAs with premium glow */}
          <motion.div
            variants={childVariants}
            className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <Phone size={20} />
              Contact Us
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary bg-white/50 px-8 py-4 text-base font-semibold text-primary shadow-sm transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5"
            >
              <HandHeart size={20} />
              Our Services
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={childVariants}
            className="mt-12 flex flex-wrap items-center gap-6 text-sm text-neutral-mid sm:gap-8"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light">
                <MapPin size={14} className="text-primary" />
              </div>
              <span className="font-medium">Broward County</span>
            </div>
            <div className="hidden h-4 w-px bg-neutral-mid/30 sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-light">
                <Clock size={14} className="text-accent" />
              </div>
              <span className="font-medium">Since 2021</span>
            </div>
            <div className="hidden h-4 w-px bg-neutral-mid/30 sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-light">
                <Shield size={14} className="text-secondary" />
              </div>
              <span className="font-medium">Licensed &amp; Insured</span>
            </div>
          </motion.div>
        </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-br from-primary via-accent to-secondary opacity-20 blur-md" />
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/hero-caregiver.jpg"
                alt="Caregiver interacting warmly with elderly patient"
                width={600}
                height={400}
                className="h-auto w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated wave SVG separator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative block h-12 w-full sm:h-16"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,40 C150,80 350,0 500,40 C650,80 800,20 1000,50 C1100,65 1150,40 1200,45 L1200,120 L0,120 Z"
            fill="white"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
          <motion.path
            d="M0,60 C200,20 400,90 600,50 C800,10 1000,70 1200,40 L1200,120 L0,120 Z"
            fill="white"
            fillOpacity="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
          />
        </motion.svg>
      </div>
    </section>
  );
}
