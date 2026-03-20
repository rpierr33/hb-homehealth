import type { Metadata } from "next";
import { AboutContent } from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Humanity & Blessings Home Health, a family-owned home health care and healthcare staffing agency in Oakland Park, FL. Founded in 2021, serving Broward County with compassion and integrity.",
};

export default function AboutPage() {
  return <AboutContent />;
}
