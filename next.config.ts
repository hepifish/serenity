import type { NextConfig } from "next";

const dev = process.env.NODE_ENV !== "production";
// Vercel injects its feedback toolbar on preview deployments only.
const toolbar = process.env.VERCEL_ENV === "preview" ? " https://vercel.live" : "";
// Map tiles, glyphs and sprites (MapLibre + OpenFreeMap).
const tiles = "https://tiles.openfreemap.org";
// Netopia's hosted card page (src/lib/netopia.ts), live and sandbox.
const netopia = "https://secure.mobilpay.ro https://secure.sandbox.netopia-payments.com";

// Static, so pages stay cacheable. Next's inline bootstrap scripts need
// 'unsafe-inline' (nonces would force every page to render per request).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}${toolbar}`,
  `style-src 'self' 'unsafe-inline'${toolbar}`,
  `img-src 'self' data: blob: ${tiles}${toolbar}`,
  `font-src 'self' data:${toolbar}`,
  `connect-src 'self' ${tiles}${dev ? " ws:" : ""}${toolbar}`,
  "worker-src 'self' blob:",
  "child-src blob:",
  `frame-src 'self'${toolbar}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  `form-action 'self' ${netopia}`,
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // While the pre-launch gate is on (src/lib/gate.ts), files the proxy never sees stay out of search too.
  ...(process.env.SITE_GATE_PASSWORD ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 60 for the Sibiu carousel, which sits darkened under a gradient
    qualities: [60, 75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Netopia's public IPN key is committed and read from disk.
  outputFileTracingIncludes: { "/api/netopia/ipn": [".netopia/netopia-ipn-public-key.pem"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // The old site's Romanian terms page.
    return [{ source: "/termeni", destination: "/ro/terms", permanent: true }];
  },
};

export default nextConfig;
