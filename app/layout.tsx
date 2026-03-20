import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { JsonLd } from "@/components/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.humanityandblessings.com"
  ),
  title: {
    default:
      "Humanity & Blessings Home Health | Home Health Care & Staffing in Oakland Park, FL",
    template: "%s | Humanity & Blessings Home Health",
  },
  description:
    "Family-owned home health care and healthcare staffing agency in Oakland Park, FL. Providing CNAs, HHAs, RNs, LPNs, and companion care across Broward County. Improving Lives Together.",
  keywords: [
    "home health care",
    "healthcare staffing",
    "Oakland Park FL",
    "Broward County",
    "CNA",
    "HHA",
    "RN",
    "LPN",
    "companion care",
    "home health aide",
    "Parkland",
    "Coral Springs",
    "Miramar",
    "Weston",
  ],
  openGraph: {
    title: "Humanity & Blessings Home Health | Improving Lives Together",
    description:
      "Family-owned home health care and healthcare staffing agency serving Broward County, FL.",
    url: "https://www.humanityandblessings.com",
    siteName: "Humanity & Blessings Home Health",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">
        <JsonLd />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileCTABar />
      </body>
    </html>
  );
}
