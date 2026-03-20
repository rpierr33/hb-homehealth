import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative">
      {/* Gradient top border */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-accent to-secondary" />

      {/* Subtle gradient overlay for depth */}
      <div className="relative bg-neutral-dark overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-primary/[0.06]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Image
                src="/logo.webp"
                alt="Humanity & Blessings Home Health"
                width={80}
                height={80}
                className="h-20 w-auto mb-5"
              />
              <p className="text-xl font-bold tracking-tight text-white">
                Humanity &amp; Blessings Home Health
              </p>
              <p className="mt-1.5 text-base font-medium text-secondary">
                Improving Lives Together
              </p>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed">
                Family-owned home health care and healthcare staffing agency
                proudly serving Broward County, FL since 2021.
              </p>

              {/* Social Media Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { label: "Facebook", href: "https://facebook.com" },
                  { label: "Instagram", href: "https://instagram.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-gray-600 px-4 py-1.5 text-xs font-semibold tracking-wide text-gray-300 transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white hover:shadow-[0_0_12px_rgba(232,71,108,0.25)]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/services", label: "Services" },
                  { href: "/careers", label: "Careers" },
                  { href: "/contact", label: "Contact" },
                  { href: "/referrals", label: "Referrals" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Services
              </h3>
              <ul className="space-y-3">
                {[
                  "Certified Nursing Assistants (CNAs)",
                  "Home Health Aides (HHAs)",
                  "Registered Nurses (RNs)",
                  "Licensed Practical Nurses (LPNs)",
                  "Companion Care",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="/services"
                      className="group relative inline-block text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                    >
                      {service}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-secondary" />
                  <span className="text-sm text-gray-300">
                    Oakland Park, FL 33334
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-secondary" />
                  <a
                    href="tel:9545550123"
                    className="group relative inline-block text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                  >
                    (954) 555-0123
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-secondary" />
                  <a
                    href="mailto:support@humanityandblessings.com"
                    className="group relative inline-block text-sm text-gray-300 transition-colors duration-300 hover:text-white"
                  >
                    support@humanityandblessings.com
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              </ul>
              <div className="mt-5">
                <p className="text-sm text-gray-400">
                  <strong className="text-gray-300">Hours:</strong>
                  <br />
                  Mon&ndash;Fri: 9:00 AM &ndash; 5:00 PM EST
                  <br />
                  Sat: Upon Request
                  <br />
                  Sun: Closed
                </p>
              </div>

              {/* Service Areas */}
              <div className="mt-8">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  Service Areas
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Parkland, Coral Springs, Miramar, Weston,
                  Lauderdale-By-The-Sea, Hollywood Beach &amp; greater Broward
                  County, FL.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-14 border-t border-gray-700/60 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Humanity &amp; Blessings Home
              Health. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
