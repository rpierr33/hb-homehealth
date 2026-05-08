import { Hero } from "@/components/sections/Hero";
import { TrustBadges } from "@/components/sections/TrustBadges";
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
      <TrustBadges />
      <ServiceAreas />
      <AboutSnapshot />
      <ServicesGrid />
      <HowItWorks />
      <Testimonials />
      <LeadCaptureInline />
    </>
  );
}
