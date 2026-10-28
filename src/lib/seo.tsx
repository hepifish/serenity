import type { Metadata } from "next";
import { LOCALES, LOCALE_TAG, type Locale } from "@/i18n/config";
import { APARTMENTS, apartmentList, type ApartmentSlug } from "./apartments";
import { COMPANY, SITE_URL } from "./site";

/** Canonical + hreflang for a path that exists in every language ("" = home). */
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((l) => [LOCALE_TAG[l], `${SITE_URL}/${l}${path}`]));
  languages["x-default"] = `${SITE_URL}/en${path}`;
  return { canonical: `${SITE_URL}/${lang}${path}`, languages };
}

export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: string): Metadata {
  const img = image ?? "/images/art/Serenity2024-56.webp";
  return {
    title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      type: "website",
      siteName: "Serenity Apartments Sibiu",
      title,
      description,
      url: `${SITE_URL}/${lang}${path}`,
      locale: LOCALE_TAG[lang].replace("-", "_"),
      images: [{ url: img, width: 1600, height: 1200 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export const GEO = { latitude: 45.803159, longitude: 24.1634059 };
export const RATING = { value: 8.9, count: 253, best: 10 };

const address = {
  "@type": "PostalAddress",
  streetAddress: "Fundătura Lupeni 2",
  postalCode: "550206",
  addressLocality: "Sibiu",
  addressRegion: "Sibiu",
  addressCountry: "RO",
};

/** The business as a whole: what search engines and AI answers quote. */
export function lodgingBusinessLd(lang: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Serenity Apartments",
    alternateName: ["Serenity House Apartments", "Serenity House Sibiu"],
    description,
    url: `${SITE_URL}/${lang}`,
    email: COMPANY.email,
    image: [`${SITE_URL}/images/art/Serenity2024-56.webp`, `${SITE_URL}/images/gotic/Serenity2024-22.webp`, `${SITE_URL}/images/film/Serenity2024-39.webp`],
    address,
    geo: { "@type": "GeoCoordinates", ...GEO },
    checkinTime: "15:00",
    checkoutTime: "11:00",
    petsAllowed: false,
    priceRange: "RON",
    currenciesAccepted: "RON",
    paymentAccepted: "Credit card, Debit card, Holiday voucher card (card de vacanță)",
    availableLanguage: ["en", "ro", "de", "es", "fr"],
    amenityFeature: ["Free Wi-Fi", "Free parking", "Kitchen", "Self check-in", "Private entrance"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    aggregateRating: { "@type": "AggregateRating", ratingValue: RATING.value, bestRating: RATING.best, reviewCount: RATING.count },
    containsPlace: apartmentList().map((a) => ({ "@id": `${SITE_URL}/${lang}/apartments/${a.slug}#apartment` })),
    parentOrganization: { "@type": "Organization", name: COMPANY.name, taxID: COMPANY.cui, address },
    sameAs: ["https://www.booking.com/hotel/ro/serenity-house-apartments.html"],
  };
}

export function apartmentLd(lang: Locale, slug: ApartmentSlug, name: string, description: string, fromPrice: number | null) {
  const a = APARTMENTS[slug];
  return {
    "@context": "https://schema.org",
    "@type": "Apartment",
    "@id": `${SITE_URL}/${lang}/apartments/${slug}#apartment`,
    name: `${name} · Serenity Apartments Sibiu`,
    description,
    url: `${SITE_URL}/${lang}/apartments/${slug}`,
    image: a.gallery.slice(0, 6).map((g) => `${SITE_URL}${g.src}`),
    address,
    geo: { "@type": "GeoCoordinates", ...GEO },
    numberOfRooms: a.bedrooms + 1,
    numberOfBedrooms: a.bedrooms,
    numberOfBathroomsTotal: 1,
    occupancy: { "@type": "QuantitativeValue", maxValue: a.maxGuests },
    ...(a.sizeM2 ? { floorSize: { "@type": "QuantitativeValue", value: a.sizeM2, unitCode: "MTK" } } : {}),
    containedInPlace: { "@id": `${SITE_URL}/#business` },
    ...(fromPrice
      ? { offers: { "@type": "Offer", priceCurrency: "RON", price: fromPrice, unitText: "night", url: `${SITE_URL}/${lang}/apartments/${slug}#availability`, availability: "https://schema.org/InStock" } }
      : {}),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
