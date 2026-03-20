"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

const mobileMenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const },
  },
  visible: {
    height: "auto" as const,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: "easeOut" as const },
  }),
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top gradient accent strip */}
      <div className="h-0.5 bg-gradient-to-r from-primary via-accent to-secondary" />

      <div
        className={cn(
          "w-full transition-all duration-300",
          scrolled
            ? "bg-white/80 shadow-md backdrop-blur-lg"
            : "bg-white"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt="Humanity & Blessings Home Health"
              width={70}
              height={70}
              className="h-16 w-auto"
            />
            <div className="hidden sm:block">
              <p className="text-lg font-bold text-primary">
                Humanity &amp; Blessings
              </p>
              <p className="text-xs text-neutral-mid">
                Improving Lives Together
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-200 hover:text-primary",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-neutral-dark"
                )}
              >
                {link.label}
                {/* Active indicator underline */}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-neutral-dark transition-colors hover:bg-neutral-light md:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="overflow-hidden md:hidden"
            >
              <div className="space-y-1 px-4 pb-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={i}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 hover:bg-primary-light",
                        isActive(link.href)
                          ? "bg-primary-light text-primary"
                          : "text-neutral-dark"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={navLinks.length}
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 block rounded-full bg-gradient-to-r from-primary to-primary-dark px-6 py-3 text-center text-sm font-semibold text-white shadow-md shadow-primary/20"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
