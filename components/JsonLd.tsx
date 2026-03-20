export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["HomeHealthCareService", "MedicalBusiness"],
    name: "Humanity & Blessings Home Health",
    description:
      "Family-owned home health care and healthcare staffing agency serving Broward County, Florida. We provide CNAs, HHAs, RNs, LPNs, companions, and sitters for compassionate in-home care.",
    url: "https://www.humanityandblessings.com",
    logo: "https://www.humanityandblessings.com/logo.webp",
    image: "https://www.humanityandblessings.com/logo.webp",
    telephone: "+1-954-000-0000",
    email: "info@humanityandblessings.com",
    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Oakland Park",
      addressRegion: "FL",
      postalCode: "33334",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.1723,
      longitude: -80.1319,
    },
    areaServed: [
      { "@type": "City", name: "Oakland Park, FL" },
      { "@type": "City", name: "Fort Lauderdale, FL" },
      { "@type": "City", name: "Parkland, FL" },
      { "@type": "City", name: "Coral Springs, FL" },
      { "@type": "City", name: "Miramar, FL" },
      { "@type": "City", name: "Weston, FL" },
      { "@type": "City", name: "Lauderdale-By-The-Sea, FL" },
      { "@type": "City", name: "Hollywood Beach, FL" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    medicalSpecialty: ["HomeHealth", "Nursing"],
    serviceType: [
      "Home Health Care",
      "Skilled Nursing",
      "Personal Care Assistance",
      "Companionship",
      "Healthcare Staffing",
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
    ],
    priceRange: "$$",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
