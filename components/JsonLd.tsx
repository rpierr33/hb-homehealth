import { SITE } from "@/lib/site-config";

export function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeHealthCareService", "MedicalBusiness"],
    "@id": "https://www.humanityandblessings.com/#organization",
    name: SITE.company.name,
    alternateName: "H&B Home Health",
    description:
      "Family-owned home health care and healthcare staffing agency serving Broward County, Florida. We provide CNAs, HHAs, RNs, LPNs, companions, and sitters for compassionate in-home care.",
    url: "https://www.humanityandblessings.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.humanityandblessings.com/logo.webp",
      width: 512,
      height: 512,
    },
    image: "https://www.humanityandblessings.com/opengraph-image",
    telephone: SITE.contact.phone.e164,
    faxNumber: SITE.contact.fax.e164,
    email: SITE.contact.email,
    foundingDate: "2021",
    founder: {
      "@type": "Organization",
      name: SITE.company.name,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.1723,
      longitude: -80.1319,
    },
    hasMap: `https://www.google.com/maps?q=${SITE.address.mapsQuery}`,
    areaServed: [
      { "@type": "City", name: "Oakland Park", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Fort Lauderdale", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Parkland", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Coral Springs", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Miramar", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Weston", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Lauderdale-By-The-Sea", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Hollywood", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Pompano Beach", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Deerfield Beach", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Coconut Creek", containedInPlace: { "@type": "State", name: "Florida" } },
      { "@type": "City", name: "Margate", containedInPlace: { "@type": "State", name: "Florida" } },
      {
        "@type": "AdministrativeArea",
        name: "Broward County",
        containedInPlace: { "@type": "State", name: "Florida" },
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    medicalSpecialty: ["HomeHealth", "Nursing"],
    availableService: [
      {
        "@type": "MedicalTherapy",
        name: "Home Health Aide (HHA) Services",
        description: "Personal care assistance including bathing, dressing, meal preparation, and medication reminders.",
      },
      {
        "@type": "MedicalTherapy",
        name: "Certified Nursing Assistant (CNA) Services",
        description: "Hands-on patient care including vital signs, ambulation assistance, and daily living activities.",
      },
      {
        "@type": "MedicalTherapy",
        name: "Registered Nurse (RN) Services",
        description: "Skilled nursing care including wound care, IV therapy, ventilator management, and care plan development.",
      },
      {
        "@type": "MedicalTherapy",
        name: "Licensed Practical Nurse (LPN) Services",
        description: "Clinical nursing care including medication administration, tube feedings, and patient assessments.",
      },
      {
        "@type": "Service",
        name: "Companion & Sitter Services",
        description: "Meaningful companionship, safety supervision, and emotional support for individuals at home.",
      },
      {
        "@type": "Service",
        name: "Healthcare Staffing",
        description: "Professional healthcare staffing solutions for facilities and families across Broward County.",
      },
    ],
    slogan: "Improving Lives Together",
    knowsAbout: [
      "Home Health Care",
      "CNA Services",
      "HHA Services",
      "Registered Nursing",
      "Licensed Practical Nursing",
      "Companion Care",
      "Respite Care",
      "Post-Surgical Home Care",
      "Chronic Disease Management",
      "Wound Care",
      "IV Therapy",
    ],
    priceRange: "$$",
    paymentAccepted: "Medicare, Medicaid, Private Insurance, Private Pay",
    currenciesAccepted: "USD",
    identifier: {
      "@type": "PropertyValue",
      name: "Florida AHCA License",
      value: SITE.company.ahcaLicense,
    },
    isAcceptingNewPatients: true,
    sameAs: [],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.humanityandblessings.com/#website",
    url: "https://www.humanityandblessings.com",
    name: SITE.company.name,
    publisher: {
      "@id": "https://www.humanityandblessings.com/#organization",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}
