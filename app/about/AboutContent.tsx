"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Shield,
  Users,
  Star,
  Target,
  Handshake,
  Eye,
  Phone,
  Award,
  Clock,
  MapPin,
  Lightbulb,
} from "lucide-react";

const coreValues = [
  { icon: Heart, title: "Compassion", description: "We treat every client with empathy, kindness, and genuine care." },
  { icon: Shield, title: "Integrity", description: "We uphold the highest ethical standards in all aspects of our services." },
  { icon: Star, title: "Excellence", description: "We deliver outstanding home health care through skilled, dedicated professionals." },
  { icon: Target, title: "Accessibility", description: "We strive to make quality home health care available to everyone who needs it." },
  { icon: Handshake, title: "Respect & Dignity", description: "Every client deserves to be treated with fairness, respect, and dignity." },
  { icon: Users, title: "Collaboration", description: "We work together with clients, families, and healthcare partners for the best outcomes." },
];

const differentiators = [
  { icon: Award, title: "Family-Owned & Operated", description: "As a family-owned business since 2021, we bring a personal touch to every interaction and genuinely care about our community." },
  { icon: Clock, title: "Flexible Scheduling", description: "We work around your schedule to provide care when you need it, including weekends upon request." },
  { icon: MapPin, title: "Local to Broward County", description: "Based in Oakland Park, we know our community and are always nearby when you need us." },
  { icon: Lightbulb, title: "Highly Skilled Specialists", description: "Our team includes CNAs, HHAs, RNs, LPNs, and companions — all thoroughly vetted and trained." },
];

export function AboutContent() {
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
                About Humanity &amp; Blessings Home Health
              </h1>
              <p className="mt-4 text-lg text-neutral-mid">
                Improving Lives Together
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
                  src="/images/testimonials-bg.jpg"
                  alt="Healthcare professional embracing senior patient"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-neutral-dark">
                Founded on Compassion &amp; Dedication
              </h2>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                Humanity &amp; Blessings Home Health was founded in 2021 as a
                family-owned business in Oakland Park, Florida. From the very
                beginning, our mission has been to serve the community with
                compassion and integrity, providing excellent home health care
                services that make a real difference in people&apos;s lives.
              </p>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                In the areas we serve throughout Broward County, our highly
                skilled specialists — including CNAs, HHAs, RNs, LPNs,
                companions, and sitters — deliver personalized care that helps
                clients maintain their independence and quality of life in the
                comfort of their own homes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/about-care.jpg"
                  alt="Caregiver helping elderly woman walk with mobility walker at home"
                  width={600}
                  height={400}
                  className="h-auto w-full object-cover"
                />
              </div>
              <div className="rounded-2xl bg-primary-light p-8">
                <h3 className="font-display text-xl font-bold text-primary">Our Philosophy</h3>
                <p className="mt-4 text-neutral-dark leading-relaxed italic">
                  &ldquo;We believe that the ongoing interaction between the
                  client, their environment, and their health behaviors has a
                  significant impact on a client&apos;s health outcome. As a
                  result, in order to maximize a client&apos;s health outcome,
                  home health care services must be aimed at achieving and
                  maintaining harmony in that ongoing, interactive process. To
                  that end, the services provided by home health care
                  professionals must not only be holistic. They must also be
                  carried out through an interdisciplinary collaborative process
                  that addresses specific client needs and takes client/family
                  preferences into account. Humanity and Blessings Home Health
                  upholds the core values of human rights respect (i.e., the
                  right to self-determination, the right to privacy and
                  confidentiality, the right to fair treatment, and the right to
                  protection from discomfort and harm), the mind/body/spirit
                  connection, as well as human care principles, serve as the
                  foundations of our services.&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-neutral-light py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary-light p-3">
                <Target size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-2xl font-bold text-neutral-dark">Our Mission</h3>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                We are a family-owned business dedicated to serving the community
                with compassion and integrity. In the areas we serve, our highly
                skilled specialists deliver excellent home health care services.
                We endeavor to exceed each client&apos;s expectations by referring
                talented and experienced independent contractors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-xl bg-accent-light p-3">
                <Eye size={28} className="text-accent" />
              </div>
              <h3 className="font-display text-2xl font-bold text-neutral-dark">Our Vision</h3>
              <p className="mt-4 text-neutral-mid leading-relaxed">
                Our vision is to become Florida&apos;s leading home health care
                and healthcare staffing firm, known by its residents for the
                unshakable devotion and dedication we put into our services. We
                strive to set the standard for excellence in home health care
                throughout the state.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-neutral-dark sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-neutral-mid">
              These values guide every interaction and decision we make.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="rounded-xl bg-white p-6 shadow-sm text-center border border-gray-100"
                >
                  <div className="mx-auto mb-3 inline-flex rounded-lg bg-primary-light p-2.5">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-neutral-dark">{value.title}</h3>
                  <p className="mt-1 text-sm text-neutral-mid">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-light py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-neutral-dark sm:text-4xl">
              Why Choose Humanity &amp; Blessings?
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {differentiators.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 rounded-xl bg-primary-light p-3 h-fit">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-dark">{item.title}</h3>
                    <p className="mt-1 text-neutral-mid">{item.description}</p>
                  </div>
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
            Let Us Care for Your Loved Ones
          </h2>
          <p className="mt-4 text-primary-light">
            Reach out today to learn how we can help you or your family member
            receive the quality home health care they deserve.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:bg-neutral-light hover:shadow-lg"
          >
            <Phone size={20} />
            Contact Us Today
          </Link>
        </div>
      </section>
    </>
  );
}
