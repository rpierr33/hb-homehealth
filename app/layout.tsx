import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { JsonLd } from "@/components/JsonLd";
import { Analytics } from "@/components/Analytics";
import { TawkTo } from "@/components/TawkTo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8476C",
};

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
    "home health care Oakland Park",
    "home health care Broward County",
    "healthcare staffing agency Florida",
    "CNA home care",
    "HHA home health aide",
    "RN home nursing",
    "LPN home care",
    "companion care Florida",
    "skilled nursing at home",
    "home health aide near me",
    "Oakland Park FL",
    "Fort Lauderdale",
    "Parkland",
    "Coral Springs",
    "Miramar",
    "Weston",
    "Broward County",
  ],
  openGraph: {
    title: "Humanity & Blessings Home Health | Improving Lives Together",
    description:
      "Family-owned home health care and healthcare staffing agency serving Broward County, FL. CNAs, HHAs, RNs, LPNs, and companion care.",
    url: "https://www.humanityandblessings.com",
    siteName: "Humanity & Blessings Home Health",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Humanity & Blessings Home Health — Compassionate Care at Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Humanity & Blessings Home Health | Home Health Care in Broward County, FL",
    description:
      "Family-owned home health care agency in Oakland Park, FL. CNAs, HHAs, RNs, LPNs, and companion care across Broward County.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: "Ovye2W7doJJMDQPi0mNn606qheB3c9CBqBR-UjIontw",
  },
  alternates: {
    canonical: "https://www.humanityandblessings.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HB Health",
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
        <Analytics />
        <JsonLd />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <MobileCTABar />
        <TawkTo />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
