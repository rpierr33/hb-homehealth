import type { Metadata } from "next";
import { ResourcesContent } from "./ResourcesContent";

export const metadata: Metadata = {
  title: "Resources",
  description: "Helpful home health care resources and links from Humanity & Blessings Home Health, including CMS, NIH, Medicare, and Florida AHCA.",
};

export default function ResourcesPage() {
  return <ResourcesContent />;
}
