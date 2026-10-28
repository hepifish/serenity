import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_TAG } from "@/i18n/config";
import { apartmentList } from "@/lib/apartments";
import { SITE_URL } from "@/lib/site";

// Apartments that are not bookable yet stay out until they have their own photos and copy.
const PATHS = ["", ...apartmentList().filter((a) => !a.comingSoon).map((a) => `/apartments/${a.slug}`), "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      lastModified: new Date(),
      changeFrequency: path.startsWith("/apartments") || path === "" ? ("weekly" as const) : ("yearly" as const),
      priority: path === "" ? 1 : path.startsWith("/apartments") ? 0.8 : 0.2,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_TAG[l], `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
