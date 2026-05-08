import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE.company.name}. Contact us by phone, email, or through our online form. Located in ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}, serving Broward County.`,
};

export default function ContactPage() {
  return <ContactContent />;
}
