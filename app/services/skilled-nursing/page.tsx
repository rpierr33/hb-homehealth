import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import { ServiceJsonLd } from "@/components/ServiceJsonLd";

export const metadata: Metadata = {
  title: "Skilled Nursing & Home Health Care in Oakland Park & Broward County, FL",
  description:
    "Comprehensive skilled nursing and home health care services in Oakland Park, Fort Lauderdale, and Broward County, FL. Personalized care plans, health assessments, chronic disease management, and rehabilitation support delivered at home.",
  keywords: [
    "skilled nursing home care Oakland Park",
    "home health care Broward County",
    "chronic disease management at home",
    "home health care near me",
    "post-hospital home care Florida",
    "rehabilitation home nursing",
    "home health agency Oakland Park",
    "Medicare home health Broward County",
    "in-home health care Fort Lauderdale",
    "senior home health services Florida",
  ],
  openGraph: {
    title: "Skilled Nursing & Home Health Care | Humanity & Blessings Home Health",
    description:
      "Comprehensive home health care and skilled nursing in Broward County, FL. Personalized care plans and clinical expertise at home.",
  },
  alternates: {
    canonical: "https://www.humanityandblessings.com/services/skilled-nursing",
  },
};

const services = [
  { name: "Personalized Care Plans", desc: "Individualized care plans developed in coordination with your physician to address your specific health needs and recovery goals." },
  { name: "Health Assessments", desc: "Comprehensive nursing assessments including vital signs, physical status, and ongoing health monitoring." },
  { name: "Chronic Disease Management", desc: "Ongoing support for managing diabetes, heart disease, COPD, and other chronic conditions at home." },
  { name: "Post-Hospital Transition", desc: "Smooth transition from hospital to home with skilled nursing support to prevent readmissions." },
  { name: "Rehabilitation Support", desc: "Support for physical recovery following surgery, illness, or injury in coordination with therapy teams." },
  { name: "Patient & Family Education", desc: "Teaching patients and families about conditions, medications, self-care techniques, and warning signs." },
  { name: "Physician Coordination", desc: "Regular communication with your medical team to ensure coordinated, effective care." },
  { name: "Fall Prevention", desc: "Home safety assessments and interventions to reduce fall risk and maintain mobility." },
];

const faqs = [
  {
    question: "What is skilled nursing home health care?",
    answer: "Skilled nursing home health care is medical care provided in your home by licensed nurses (RNs and LPNs) under a physician's order. It includes health assessments, medication management, wound care, IV therapy, disease management, and patient education. It's designed for people recovering from illness, surgery, or hospitalization, or those managing chronic conditions who need professional clinical support at home.",
  },
  {
    question: "Who qualifies for home health care services?",
    answer: "Individuals who are homebound or have difficulty leaving their home, have a medical condition requiring skilled nursing care, and have a physician's order for home health services typically qualify. Medicare, Medicaid, and many private insurance plans cover home health care when it's medically necessary. Contact us for a free eligibility assessment.",
  },
  {
    question: "How is home health care different from home care?",
    answer: "Home health care involves skilled medical services (nursing, therapy) provided under a physician's plan of care — often covered by insurance. Home care (also called personal care or non-medical care) includes assistance with daily activities like bathing, meal prep, and companionship. At Humanity & Blessings, we provide both types of care to serve the full spectrum of needs.",
  },
  {
    question: "Does Medicare cover home health care in Florida?",
    answer: "Yes, Medicare covers home health care services when you meet eligibility requirements: you must be homebound, need skilled nursing or therapy services, and have a physician's order. Medicare covers skilled nursing visits, therapy, medical social services, and some home health aide services. Our team can help verify your coverage at no cost.",
  },
];

export default function SkilledNursingPage() {
  return (
    <>
      <ServiceJsonLd
        name="Skilled Nursing & Home Health Care"
        description="Comprehensive skilled nursing and home health care services including personalized care plans, health assessments, chronic disease management, and rehabilitation support in Broward County, FL."
        url="/services/skilled-nursing"
        serviceType="Skilled Nursing Home Health Care"
        faqs={faqs}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-1 text-sm text-[#E8476C] hover:text-[#c73a5a] mb-4">
            <ArrowLeft size={14} /> All Services
          </Link>
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex rounded-xl bg-accent-light p-3">
              <Stethoscope size={28} className="text-accent" />
            </div>
            <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
              Skilled Nursing &amp; Home Health Care
            </h1>
            <p className="mt-6 text-lg text-neutral-mid leading-relaxed">
              Comprehensive home health care combining clinical expertise with
              compassionate, personalized attention. Our skilled nursing team delivers
              hospital-quality care in the comfort of your home, serving
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
            Our Home Health Care Services
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.name} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 rounded-full bg-accent-light p-1.5 mt-1">
                    <ShieldCheck size={14} className="text-accent" />
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
            Frequently Asked Questions About Home Health Care
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
            Need Home Health Care in Broward County?
          </h2>
          <p className="mt-4 text-primary-light">
            Let us create a personalized care plan for you or your loved one.
            Contact us today for a free consultation and eligibility assessment.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-primary transition-all hover:bg-neutral-light hover:shadow-lg"
            >
              <Phone size={20} />
              Free Consultation
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
