import type { Metadata } from "next";
import { CareersContent } from "./CareersContent";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Humanity & Blessings Home Health team. We're hiring CNAs, HHAs, RNs, LPNs, and Companions in Broward County, FL. Apply today.",
};

export default function CareersPage() {
  return <CareersContent />;
}
