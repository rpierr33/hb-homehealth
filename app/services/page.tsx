import type { Metadata } from "next";
import { ServicesContent } from "./ServicesContent";

export const metadata: Metadata = {
  title: "Services",
  description: "Home health care services from Humanity & Blessings Home Health in Oakland Park, FL. CNAs, HHAs, RNs, LPNs, Companions, and Sitters serving Broward County.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
