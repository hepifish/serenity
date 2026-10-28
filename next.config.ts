import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // 60 for the Sibiu carousel, which sits darkened under a gradient
    qualities: [60, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Netopia's public key is read from disk when the env var is not set.
  outputFileTracingIncludes: { "/api/netopia/ipn": [".netopia/netopia-ipn-public-key.pem"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // One canonical host, the apex (src/lib/site.ts): www answers with a 301 to it.
    const site = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://serenityapartments.ro");
    const toApex = site.hostname.startsWith("www.") || site.hostname === "localhost"
      ? []
      : [{ source: "/:path*", has: [{ type: "host" as const, value: `www.${site.hostname}` }], destination: `${site.origin}/:path*`, statusCode: 301 as const }];
    return [
      ...toApex,
      // The old site's Romanian terms page; it only ever had / and /termeni.
      { source: "/termeni", destination: "/ro/terms", permanent: true },
    ];
  },
};

export default nextConfig;
