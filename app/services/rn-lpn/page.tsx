import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, ShieldCheck, Phone, ArrowLeft } from "lucide-react";
import { ServiceJsonLd } from "@/components/ServiceJsonLd";

export const metadata: Metadata = {
  title: "RN & LPN Skilled Nursing Services at Home in Oakland Park & Broward County, FL",
  description:
    "Registered Nurses (RNs) and Licensed Practical Nurses (LPNs) providing skilled nursing care at home including wound care, IV therapy, ventilator management, and post-surgical care in Oakland Park, Fort Lauderdale, and Broward County, FL.",
  keywords: [
    "RN home nursing Oakland Park",
    "LPN home care Broward County",
    "skilled nursing at home Florida",
    "wound care home nurse",
    "IV therapy home care",
    "ventilator care at home",
    "post-surgical home nursing",
    "registered nurse Fort Lauderdale",
    "home nursing Coral Springs",
    "tube feeding home care",
  ],
  openGraph: {
    title: "RN & LPN Skilled Nursing at Home | Humanity & Blessings Home Health",
    description:
      "Skilled nursing care at home by RNs and LPNs in Broward County, FL. Wound care, IV therapy, ventilators, and more.",
  },
  alternates: {
    canonical: "https://www.humanityandblessings.com/services/rn-lpn",
  },
};

const services = [
  { name: "Wound Care", desc: "Professional wound assessment, cleaning, dressing changes, and monitoring for proper healing." },
  { name: "Tube Feedings", desc: "Safe administration and management of enteral nutrition including G-tube and NG-tube feedings." },
  { name: "Ventilator Management", desc: "Expert monitoring and care for patients on home ventilators, ensuring proper function and comfort." },
  { name: "Infusion Therapy (IV)", desc: "Administration of IV medications, antibiotics, hydration, and nutrition in the home setting." },
  { name: "Post-Surgical Care", desc: "Comprehensive recovery support after surgery including monitoring vitals, managing medications, and wound care." },
  { name: "Medication Administration", desc: "Professional administration of prescribed medications including injections and complex drug regimens." },
  { name: "Patient Assessment", desc: "Regular nursing assessments to monitor health status, identify changes, and coordinate with physicians." },
  { name: "Care Plan Management", desc: "Development and ongoing management of individualized care plans in coordination with the medical team." },
];

const faqs = [
  {
    question: "What skilled nursing services can be provided at home?",
    answer: "Our RNs and LPNs provide a wide range of skilled nursing services at home including wound care, tube feedings, ventilator management, IV therapy, post-surgical care, medication administration, vital signs monitoring, and patient education. We bring hospital-level clinical expertise to the comfort of your home.",
  },
  {
    question: "When do I need an RN vs an LPN for home care?",
    answer: "Registered Nurses (RNs) handle complex clinical assessments, care plan development, IV therapy, and ventilator management. Licensed Practical Nurses (LPNs) provide excellent clinical care including medication administration, tube feedings, wound care, and routine nursing tasks under RN supervision. Our team will match you with the right level of care for your needs.",
  },
  {
    question: "Does insurance cover skilled nursing at home?",
    answer: "Many insurance plans, including Medicare and Medicaid, cover skilled nursing services when medically necessary and ordered by a physician. We can help you understand your coverage and navigate the authorization process. Contact us for a free insurance verification.",
  },
  {
    question: "How quickly can skilled nursing care start?",
    answer: "In many cases, we can begin skilled nursing services within 24-48 hours of receiving a physician's order. For urgent cases, we work to expedite the process. Contact us for immediate assistance with your skilled nursing needs in Broward County.",
  },
];

export default function RnLpnPage() {
  return (
    <>
      <ServiceJsonLd
        name="RN & LPN Skilled Nursing Services"
        description="Registered Nurses and Licensed Practical Nurses providing skilled nursing care at home including wound care, IV therapy, ventilator management, and post-surgical care in Broward County, FL."
        url="/services/rn-lpn"
        serviceType="Skilled Nursing Services"
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
              Registered Nurses (RNs) &amp; Licensed Practical Nurses (LPNs)
            </h1>
            <p className="mt-6 text-lg text-neutral-mid leading-relaxed">
              Our skilled nursing professionals bring hospital-quality clinical care
              directly to your home. From wound care and IV therapy to ventilator management
              and post-surgical recovery, our RNs and LPNs deliver expert medical care
              throughout <strong>Oakland Park, Fort Lauderdale, Parkland, Coral Springs,
              Miramar, Weston</strong>, and all of <strong>Broward County, Florida</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-neutral-dark text-center mb-12">
            Skilled Nursing Services We Provide at Home
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
            Frequently Asked Questions About Skilled Nursing at Home
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
            Need Skilled Nursing Care at Home?
          </h2>
          <p className="mt-4 text-primary-light">
            Our RNs and LPNs provide expert medical care in the comfort of your home.
            Contact us today or make a referral to get started.
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
