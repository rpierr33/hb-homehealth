import { Hero } from "@/components/sections/Hero";
import { ServiceAreas } from "@/components/sections/ServiceAreas";
import { AboutSnapshot } from "@/components/sections/AboutSnapshot";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Testimonials } from "@/components/sections/Testimonials";
import { LeadCaptureInline } from "@/components/sections/LeadCaptureInline";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceAreas />
      <AboutSnapshot />
      <ServicesGrid />
      <HowItWorks />
      <Testimonials />
      <LeadCaptureInline />
    </>
  );
}
