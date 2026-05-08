import { SITE } from "@/lib/site-config";

interface ServiceJsonLdProps {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  faqs?: { question: string; answer: string }[];
}

export function ServiceJsonLd({ name, description, url, serviceType, faqs }: ServiceJsonLdProps) {
  const baseUrl = "https://www.humanityandblessings.com";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${baseUrl}${url}`,
    name: `${name} - ${SITE.company.name}`,
    description,
    url: `${baseUrl}${url}`,
    parentOrganization: {
      "@type": "HomeHealthCareService",
      name: SITE.company.name,
      url: baseUrl,
    },
    serviceType,
    areaServed: [
      { "@type": "City", name: "Oakland Park, FL" },
      { "@type": "City", name: "Fort Lauderdale, FL" },
      { "@type": "City", name: "Parkland, FL" },
      { "@type": "City", name: "Coral Springs, FL" },
      { "@type": "City", name: "Miramar, FL" },
      { "@type": "City", name: "Weston, FL" },
      { "@type": "City", name: "Lauderdale-By-The-Sea, FL" },
      { "@type": "City", name: "Hollywood, FL" },
      { "@type": "City", name: "Pompano Beach, FL" },
      { "@type": "City", name: "Deerfield Beach, FL" },
      { "@type": "City", name: "Coconut Creek, FL" },
      { "@type": "City", name: "Margate, FL" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
      addressCountry: SITE.address.country,
    },
    telephone: SITE.contact.phone.e164,
    priceRange: "$$",
  };

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
