import type { MetadataRoute } from "next";
import { TERMS_VERSION } from "@/content/terms";
import { LOCALES } from "@/i18n/config";
import { apartmentList } from "@/lib/apartments";
import { languageAlternates } from "@/lib/seo";
import { CONTENT_UPDATED, SITE_URL } from "@/lib/site";

// Apartments that are not bookable yet stay out until they have their own photos and copy.
const PATHS = ["", ...apartmentList().filter((a) => !a.comingSoon).map((a) => `/apartments/${a.slug}`), "/terms", "/privacy"];

// A real date per page, so crawlers can trust it: the terms carry their version
// date, everything else the date the copy last changed.
const updated = (path: string) => new Date(path === "/terms" ? TERMS_VERSION : CONTENT_UPDATED);

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: updated(path),
      changeFrequency: path.startsWith("/apartments") || path === "" ? ("weekly" as const) : ("yearly" as const),
      priority: path === "" ? 1 : path.startsWith("/apartments") ? 0.8 : 0.2,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
