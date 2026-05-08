import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://embed.tawk.to https://va.tawk.to https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://embed.tawk.to",
              "font-src 'self' https://fonts.gstatic.com https://embed.tawk.to",
              "img-src 'self' data: blob: https:",
              "frame-src https://www.google.com https://growtherapy.com https://headway.co https://tawk.to https://*.tawk.to",
              "connect-src 'self' https://*.ingest.sentry.io https://*.google-analytics.com https://*.tawk.to wss://*.tawk.to",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: "kalocode",
  project: "hb-homehealth",
  silent: true,
  sourcemaps: { disable: true },
});
