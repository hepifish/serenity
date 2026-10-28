import type { Locale } from "@/i18n/config";
import manifest from "./image-manifest.json";

/**
 * The four apartments. Facts live here once; the words about them live in
 * src/i18n/apartments.ts per language.
 */
export const APARTMENT_SLUGS = ["film-studio", "gothic-chambers", "art-station", "pink-panther"] as const;
export type ApartmentSlug = (typeof APARTMENT_SLUGS)[number];

export type Apartment = {
  slug: ApartmentSlug;
  name: string;
  number: string;
  /** accent colour, used sparingly: a rule, a dot, the selected nights */
  accent: string;
  maxGuests: number;
  bedrooms: number;
  beds: string;
  sizeM2?: number;
  /** which photo stands for the apartment in the home hero, and where to aim the crop */
  heroIndex?: number;
  heroFocus?: string;
  /** listed here but not bookable online yet (no calendar or photos) */
  comingSoon?: boolean;
  icalEnv: string;
  bookingUrl: string;
  gallery: { src: string; w: number; h: number }[];
};

export function isApartmentSlug(s: string): s is ApartmentSlug {
  return (APARTMENT_SLUGS as readonly string[]).includes(s);
}

const BOOKING_PAGE = "https://www.booking.com/hotel/ro/serenity-house-apartments.html";

const img = (dir: string, files: string[]) =>
  files.map((f) => {
    const src = `/images/${dir}/${f}.webp`;
    const [w, h] = (manifest as Record<string, number[]>)[src] ?? [1600, 1200];
    return { src, w, h };
  });

export const APARTMENTS: Record<ApartmentSlug, Apartment> = {
  "film-studio": {
    slug: "film-studio",
    name: "Film Studio",
    number: "01",
    accent: "#D9A93B",
    maxGuests: 4,
    bedrooms: 1,
    beds: "queen + sofa bed",
    sizeM2: 45,
    icalEnv: "BOOKING_ICAL_FILM",
    heroIndex: 1,
    heroFocus: "50% 30%",
    bookingUrl: BOOKING_PAGE,
    gallery: img("film", ["Serenity2024-29", "Serenity2024-37", "Serenity2024-36", "Serenity2024-34", "Serenity2024-33", "Serenity2024-35", "Serenity2024-39", "Serenity2024-40", "Serenity2024-59", "Serenity2024-38", "Serenity2024-32", "Serenity2024-58", "Serenity2024-41", "Serenity2024-42", "Serenity2024-30", "Serenity2024-31", "Serenity2024-27", "Serenity2024-28"]),
  },
  "gothic-chambers": {
    slug: "gothic-chambers",
    name: "Gothic Chambers",
    number: "02",
    accent: "#B5475F",
    maxGuests: 4,
    bedrooms: 1,
    beds: "queen + sofa bed",
    sizeM2: 45,
    icalEnv: "BOOKING_ICAL_GOTHIC",
    heroIndex: 1,
    heroFocus: "50% 40%",
    bookingUrl: BOOKING_PAGE,
    gallery: img("gotic", ["Serenity2024-22", "Serenity2024-60", "Serenity2024-26", "Serenity2024-24", "Serenity2024-48", "Serenity2024-19", "Serenity2024-20", "Serenity2024-14", "Serenity2024-23", "Serenity2024-13", "Serenity2024-61", "Serenity2024-45", "Serenity2024-21", "Serenity2024-25", "Serenity2024-46", "Serenity2024-47", "Serenity2024-49", "Serenity2024-15", "Serenity2024-16", "Serenity2024-17", "Serenity2024-18"]),
  },
  "art-station": {
    slug: "art-station",
    name: "Art Station",
    number: "03",
    accent: "#D0503C",
    maxGuests: 4,
    bedrooms: 1,
    beds: "queen + sofa bed",
    sizeM2: 45,
    icalEnv: "BOOKING_ICAL_ART",
    heroIndex: 1,
    heroFocus: "50% 35%",
    bookingUrl: BOOKING_PAGE,
    gallery: img("art", ["Serenity2024-56", "Serenity2024-43", "Serenity2024-03", "Serenity2024-04", "Serenity2024-08", "Serenity2024-54", "Serenity2024-51", "Serenity2024-05", "Serenity2024-12", "Serenity2024-55", "Serenity2024-50", "Serenity2024-06", "Serenity2024-07", "Serenity2024-52", "Serenity2024-53", "Serenity2024-02", "Serenity2024-01", "Serenity2024-09", "Serenity2024-10", "Serenity2024-11"]),
  },
  "pink-panther": {
    slug: "pink-panther",
    name: "Pink Panther",
    number: "04",
    accent: "#E39AB4",
    maxGuests: 6,
    bedrooms: 2,
    beds: "2 king + sofa bed",
    sizeM2: 56,
    icalEnv: "BOOKING_ICAL_PINK",
    heroIndex: 0,
    heroFocus: "18% 30%",
    bookingUrl: "https://www.booking.com/hotel/ro/feel-like-home-pink-panther-apartment.html",
    gallery: img("pink", ["pink-01", "pink-03", "pink-10", "pink-19", "pink-02", "pink-09", "pink-06", "pink-04", "pink-05", "pink-07",
      "pink-08", "pink-11", "pink-12", "pink-18", "pink-16", "pink-17", "pink-13", "pink-14", "pink-15", "pink-20", "pink-21"]),
  },

};

export const apartmentList = () => APARTMENT_SLUGS.map((s) => APARTMENTS[s]);

export type ApartmentCopy = {
  tagline: string;
  intro: string;
  story: string[];
  highlights: string[];
  alts: string[];
};
export type ApartmentCopyByLocale = Record<Locale, Record<ApartmentSlug, ApartmentCopy>>;
