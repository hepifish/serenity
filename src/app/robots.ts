import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Search and AI answer engines are welcome everywhere guests can go; the
// admin, the booking flow and the API are nobody's business.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/dev/", "/ical/", "/*/book", "/*/booking/", "/*/checkin"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
