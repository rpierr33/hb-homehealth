import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import { ServiceJsonLd } from "@/components/ServiceJsonLd";

export const metadata: Metadata = {
  title: "CNA & HHA Home Health Aide Services in Oakland Park & Broward County, FL",
  description:
    "Certified Nursing Assistants (CNAs) and Home Health Aides (HHAs) providing personal care, bathing, dressing, meal preparation, and medication reminders in Oakland Park, Fort Lauderdale, and all of Broward County, FL.",
  keywords: [
    "CNA home care Oakland Park",
    "HHA home health aide Broward County",
    "certified nursing assistant Florida",
    "home health aide near me",
    "personal care assistant Fort Lauderdale",
    "bathing assistance home care",
    "in-home caregiver Broward County",
    "home health aide Parkland",
    "CNA Coral Springs FL",
    "HHA Miramar FL",
  ],
  openGraph: {
    title: "CNA & HHA Home Health Aide Services | Humanity & Blessings Home Health",
    description:
      "Professional CNAs and HHAs providing compassionate personal care in Oakland Park and Broward County, FL. Bathing, dressing, meal prep, and more.",
  },
  alternates: {
    canonical: "https://www.humanityandblessings.com/services/cna-hha",
  },
};

const services = [
  { name: "Bathing & Personal Hygiene", desc: "Assistance with bathing, grooming, and personal hygiene to maintain dignity and comfort." },
  { name: "Dressing Assistance", desc: "Help with selecting appropriate clothing and getting dressed each day." },
  { name: "Toileting & Incontinence Care", desc: "Discreet assistance with toileting needs and incontinence management." },
  { name: "Feeding & Nutrition Support", desc: "Help with eating, feeding, and ensuring proper nutrition intake." },
  { name: "Meal Preparation", desc: "Planning and preparing nutritious meals tailored to dietary needs and preferences." },
  { name: "Medication Reminders", desc: "Timely reminders to take prescribed medications as directed by physicians." },
  { name: "Light Housekeeping", desc: "Maintaining a clean, safe living environment including laundry and tidying." },
  { name: "Ambulation & Mobility Assistance", desc: "Help with walking, transfers, and safe movement throughout the home." },
  { name: "Errands & Transportation", desc: "Assistance with grocery shopping, pharmacy runs, and appointment transportation." },
];

const faqs = [
  {
    question: "What is the difference between a CNA and an HHA?",
    answer: "A Certified Nursing Assistant (CNA) has completed a state-approved training program and passed a certification exam. They can perform clinical tasks like taking vital signs. A Home Health Aide (HHA) provides personal care and daily living assistance. Both are trained to deliver compassionate in-home care. At Humanity & Blessings Home Health, all our CNAs and HHAs are fully certified and background-checked.",
  },
  {
    question: "What areas do your CNA and HHA services cover in Florida?",
    answer: "We provide CNA and HHA home care services throughout Broward County, Florida, including Oakland Park, Fort Lauderdale, Parkland, Coral Springs, Miramar, Weston, Pompano Beach, Deerfield Beach, Coconut Creek, Hollywood, and surrounding communities.",
  },
  {
    question: "How do I get started with a home health aide?",
    answer: "Contact us by phone or through our online form to schedule a free consultation. We'll assess your care needs, match you with the right CNA or HHA, and create a personalized care plan. Care can often begin within 24-48 hours of your initial call.",
  },
  {
    question: "Are your CNAs and HHAs insured and background-checked?",
    answer: "Yes. Every CNA and HHA at Humanity & Blessings Home Health undergoes a thorough background check, is fully insured, and maintains current certifications. Your safety and peace of mind are our top priorities.",
  },
];

export default function CnaHhaPage() {
  return (
    <>
      <ServiceJsonLd
        name="CNA & HHA Home Health Aide Services"
        description="Certified Nursing Assistants and Home Health Aides providing personal care, bathing, dressing, meal preparation, and medication reminders in Broward County, FL."
        url="/services/cna-hha"
        serviceType="Home Health Aide Services"
        faqs={faqs}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-[#E8476C] hover:text-[#c73a5a] mb-4">
            <ArrowLeft size={14} /> All Services
          </Link>
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex rounded-xl bg-primary-light p-3">
              <Heart size={28} className="text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
              Home Health Aides (HHAs) &amp; Certified Nursing Assistants (CNAs)
            </h1>
            <p className="mt-6 text-lg text-neutral-mid leading-relaxed">
              Our HHAs and CNAs provide compassionate, hands-on personal care assistance
              to help clients maintain their independence and dignity in the comfort of
              their own homes. Serving <strong>Oakland Park, Fort Lauderdale, Parkland,
              Coral Springs, Miramar, Weston</strong>, and all of <strong>Broward County, Florida</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-neutral-dark text-center mb-12">
            What Our CNAs &amp; HHAs Provide
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-secondary-light p-1.5 mt-1">
                    <ShieldCheck size={14} className="text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark">{s.name}</h3>
                    <p className="mt-1 text-sm text-neutral-mid">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-light py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-neutral-dark text-center mb-12">
            Frequently Asked Questions About CNA &amp; HHA Services
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-neutral-dark">{faq.question}</h3>
                <p className="mt-2 text-neutral-mid text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold">
            Need a CNA or HHA in Broward County?
          </h2>
          <p className="mt-4 text-primary-light">
            Contact us today for a free consultation. We&apos;ll match you with a caring professional
            who meets your specific needs. Care can start within 24-48 hours.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:bg-neutral-light hover:shadow-lg"
            >
              <Phone size={20} />
              Get Started
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
