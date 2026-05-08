import type { Metadata } from "next";
import Link from "next/link";
import { Users, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import { ServiceJsonLd } from "@/components/ServiceJsonLd";

export const metadata: Metadata = {
  title: "Companion & Sitter Services in Oakland Park & Broward County, FL",
  description:
    "Professional companion care and sitter services in Oakland Park, Fort Lauderdale, and Broward County, FL. Meaningful companionship, safety supervision, and emotional support for seniors and individuals needing a caring presence at home.",
  keywords: [
    "companion care Oakland Park FL",
    "sitter services Broward County",
    "senior companion care Florida",
    "elderly companion Fort Lauderdale",
    "in-home sitter near me",
    "companion for elderly parents",
    "senior safety supervision",
    "overnight sitter Broward County",
    "companionship services Parkland",
    "respite care Florida",
  ],
  openGraph: {
    title: "Companion & Sitter Services | Humanity & Blessings Home Health",
    description:
      "Compassionate companion and sitter services for seniors in Oakland Park and Broward County, FL. Reducing isolation and providing safety supervision.",
  },
  alternates: {
    canonical: "https://www.humanityandblessings.com/services/companion-sitter",
  },
};

const services = [
  { name: "Meaningful Companionship", desc: "Engaging conversation, social interaction, and emotional support to combat loneliness and isolation." },
  { name: "Safety Supervision", desc: "Attentive presence and monitoring to ensure client safety, especially for those at risk of falls." },
  { name: "Recreational Activities", desc: "Playing games, reading, puzzles, and other activities to stimulate the mind and brighten the day." },
  { name: "Accompaniment on Outings", desc: "Escorting clients to social events, religious services, doctor appointments, and errands." },
  { name: "Light Meal Preparation", desc: "Preparing snacks and light meals, and ensuring clients stay hydrated throughout the day." },
  { name: "Medication Reminders", desc: "Gentle reminders to take medications on schedule as prescribed by physicians." },
  { name: "Overnight & Weekend Availability", desc: "Flexible scheduling including overnight stays and weekend coverage for continuous peace of mind." },
  { name: "Respite Care for Families", desc: "Giving family caregivers a much-needed break while ensuring their loved one receives quality attention." },
];

const faqs = [
  {
    question: "What is the difference between companion care and home health aide services?",
    answer: "Companion care focuses on social interaction, emotional support, and light supervision — ideal for seniors who are mostly independent but benefit from a caring presence. Home health aide (HHA) services include hands-on personal care like bathing, dressing, and toileting. At Humanity & Blessings, we can match you with the right level of care for your specific situation.",
  },
  {
    question: "Can a companion help my parent who lives alone?",
    answer: "Absolutely. Our companions provide regular visits to check on your loved one, engage them in conversation and activities, ensure they're eating properly, remind them of medications, and provide a reassuring presence. This is one of the most popular services we offer for families with aging parents in Broward County.",
  },
  {
    question: "Do you offer overnight sitter services?",
    answer: "Yes, we offer flexible scheduling including overnight sitters, weekend coverage, and 24-hour care. Whether you need a few hours a week or round-the-clock companionship, we can create a schedule that fits your needs and budget.",
  },
  {
    question: "How does companion care help prevent senior isolation?",
    answer: "Social isolation is a serious health risk for seniors, linked to depression, cognitive decline, and physical health problems. Our companions provide regular, meaningful social interaction, accompany clients on outings, encourage hobbies and activities, and serve as a friendly, consistent presence. Many families in Oakland Park and Broward County tell us our companions become like extended family.",
  },
];

export default function CompanionSitterPage() {
  return (
    <>
      <ServiceJsonLd
        name="Companion & Sitter Services"
        description="Professional companion care and sitter services providing meaningful companionship, safety supervision, and emotional support in Broward County, FL."
        url="/services/companion-sitter"
        serviceType="Companion Care Services"
        faqs={faqs}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-[#E8476C] hover:text-[#c73a5a] mb-4">
            <ArrowLeft size={14} /> All Services
          </Link>
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex rounded-xl bg-secondary-light p-3">
              <Users size={28} className="text-secondary" />
            </div>
            <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
              Companions &amp; Sitters
            </h1>
            <p className="mt-6 text-lg text-neutral-mid leading-relaxed">
              Our companion and sitter services provide meaningful social interaction,
              supervision, and emotional support for individuals who may feel isolated
              or need someone present for safety and comfort. Serving
              <strong> Oakland Park, Fort Lauderdale, Parkland, Coral Springs,
              Miramar, Weston</strong>, and all of <strong>Broward County, Florida</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-neutral-dark text-center mb-12">
            What Our Companions &amp; Sitters Provide
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
            Frequently Asked Questions About Companion &amp; Sitter Services
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
            Looking for a Companion or Sitter in Broward County?
          </h2>
          <p className="mt-4 text-primary-light">
            Our compassionate companions provide the social interaction and supervision
            your loved one deserves. Contact us for a free consultation.
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
