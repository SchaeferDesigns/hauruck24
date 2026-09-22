import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /* Die Rechtstexte werden zur Laufzeit aus dem Dateisystem gelesen
     und muessen deshalb im Deployment enthalten sein. */
  outputFileTracingIncludes: {
    "/impressum": ["./src/content/legal/**"],
    "/datenschutz": ["./src/content/legal/**"],
    "/agb": ["./src/content/legal/**"],
    "/widerruf": ["./src/content/legal/**"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
