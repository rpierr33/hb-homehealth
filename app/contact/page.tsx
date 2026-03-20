import type { Metadata } from "next";
import { ContactContent } from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Humanity & Blessings Home Health. Contact us by phone, email, or through our online form. Located in Oakland Park, FL 33334, serving Broward County.",
};

export default function ContactPage() {
  return <ContactContent />;
}
