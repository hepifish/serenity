import type { Metadata } from "next";
import { HREFLANG, LOCALES, OG_LOCALE, type Locale } from "@/i18n/config";
import { AMENITY_NAME, APARTMENTS, apartmentList, directionsUrl, type ApartmentSlug } from "./apartments";
import { ADDRESS, COMPANY, SITE_URL } from "./site";

/** hreflang map for a path that exists in every language ("" = home), x-default included. */
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(LOCALES.map((l) => [HREFLANG[l], `${SITE_URL}/${l}${path}`]));
  languages["x-default"] = `${SITE_URL}/en${path}`;
  return languages;
}

/** Canonical + hreflang. */
export function alternates(lang: Locale, path: string): Metadata["alternates"] {
  return { canonical: `${SITE_URL}/${lang}${path}`, languages: languageAlternates(path) };
}

/** Cuts at the last word that fits, never mid-word, and ends the sentence cleanly. */
export function clip(text: string, max = 158) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,;:.·]+$/, "")}…`;
}

/** Share previews: 1200×630 JPGs made from the real photos by scripts/og-images.mjs. */
export const ogImage = (name: "home" | ApartmentSlug) => `/og/${name}.jpg`;

export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: { url: string; alt: string }): Metadata {
  const img = { url: image?.url ?? ogImage("home"), width: 1200, height: 630, alt: image?.alt ?? "Serenity Apartments Sibiu" };
  const desc = clip(description);
  return {
    title,
    description: desc,
    alternates: alternates(lang, path),
    openGraph: {
      type: "website",
      siteName: "Serenity Apartments Sibiu",
      title,
      description: desc,
      url: `${SITE_URL}/${lang}${path}`,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [img],
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [img] },
  };
}

const BUSINESS_ID = `${SITE_URL}/#business`;
/** One entity per apartment whatever the language, so RO/EN/DE pages describe the same thing. */
export const apartmentId = (slug: ApartmentSlug) => `${SITE_URL}/apartments/${slug}#apartment`;

const LUPENI = APARTMENTS["film-studio"];

const lupeniAddress = {
  "@type": "PostalAddress",
  streetAddress: ADDRESS.street,
  postalCode: ADDRESS.postalCode,
  addressLocality: ADDRESS.city,
  addressRegion: ADDRESS.region,
  addressCountry: ADDRESS.country,
};

/** Sibiu with its German and Hungarian names, so "Hermannstadt" searches find us. */
const SIBIU = {
  "@type": "City",
  name: "Sibiu",
  alternateName: ["Hermannstadt", "Nagyszeben"],
  sameAs: "https://en.wikipedia.org/wiki/Sibiu",
};

const telephone = COMPANY.phone ? { telephone: COMPANY.phone.tel } : {};

/** "from" price per night as an Offer the business makes on one apartment. */
function offer(lang: Locale, slug: ApartmentSlug, price: number) {
  return {
    "@type": "Offer",
    itemOffered: { "@id": apartmentId(slug) },
    url: `${SITE_URL}/${lang}/apartments/${slug}#availability`,
    priceSpecification: { "@type": "UnitPriceSpecification", minPrice: price, priceCurrency: "RON", unitText: "night" },
  };
}

/** The business as a whole: what search engines and AI answers quote. */
export function lodgingBusinessLd(lang: Locale, description: string, prices: Partial<Record<ApartmentSlug, number | null>>) {
  const known = apartmentList().flatMap((a) => (prices[a.slug] ? [[a.slug, prices[a.slug]!] as const] : []));
  const values = known.map(([, p]) => p);
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: "Serenity Apartments",
    alternateName: ["Serenity House Apartments", "Serenity House Sibiu"],
    description,
    url: `${SITE_URL}/${lang}`,
    email: COMPANY.email,
    ...telephone,
    image: [`${SITE_URL}${ogImage("home")}`, ...apartmentList().map((a) => `${SITE_URL}${a.gallery[a.pageHeroIndex ?? 0].src}`)],
    address: lupeniAddress,
    geo: { "@type": "GeoCoordinates", latitude: LUPENI.lat, longitude: LUPENI.lng },
    hasMap: directionsUrl(LUPENI.lat, LUPENI.lng),
    containedInPlace: SIBIU,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    petsAllowed: false,
    ...(values.length ? { priceRange: `${Math.min(...values)}–${Math.max(...values)} RON` } : {}),
    currenciesAccepted: "RON",
    paymentAccepted: "Credit card, Debit card, Holiday voucher card (card de vacanță)",
    availableLanguage: ["en", "ro", "de"],
    knowsLanguage: ["en", "ro", "de"],
    amenityFeature: ["Free Wi-Fi", "Free parking", "Kitchen", "Self check-in"].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    containsPlace: apartmentList().map((a) => ({ "@id": apartmentId(a.slug) })),
    ...(known.length ? { makesOffer: known.map(([slug, p]) => offer(lang, slug, p)) } : {}),
    parentOrganization: { "@type": "Organization", name: COMPANY.name, taxID: COMPANY.cui, address: lupeniAddress },
    sameAs: ["https://www.booking.com/hotel/ro/serenity-house-apartments.html"],
  };
}

const PINK_BOOKING_NAME = "Feel Like Home Pink Panther Apartment";

/** One apartment, plus the business's offer on it. */
export function apartmentLd(lang: Locale, slug: ApartmentSlug, description: string, imageAlt: string, fromPrice: number | null) {
  const a = APARTMENTS[slug];
  const apartment = {
    "@type": "Apartment",
    "@id": apartmentId(slug),
    name: a.name,
    ...(a.inHouse ? {} : { alternateName: PINK_BOOKING_NAME }),
    description,
    url: `${SITE_URL}/${lang}/apartments/${slug}`,
    image: a.gallery.slice(0, 6).map((g, i) => (i === 0 ? { "@type": "ImageObject", url: `${SITE_URL}${g.src}`, caption: imageAlt } : `${SITE_URL}${g.src}`)),
    address: {
      "@type": "PostalAddress",
      streetAddress: a.address.streetAddress,
      ...(a.address.postalCode ? { postalCode: a.address.postalCode } : {}),
      addressLocality: a.address.locality,
      addressRegion: ADDRESS.region,
      addressCountry: ADDRESS.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: a.lat, longitude: a.lng },
    hasMap: directionsUrl(a.lat, a.lng),
    numberOfRooms: a.bedrooms + 1,
    numberOfBedrooms: a.bedrooms,
    numberOfBathroomsTotal: 1,
    occupancy: { "@type": "QuantitativeValue", maxValue: a.maxGuests, unitCode: "C62" },
    ...(a.sizeM2 ? { floorSize: { "@type": "QuantitativeValue", value: a.sizeM2, unitCode: "MTK" } } : {}),
    bed: a.bedDetails.map((b) => ({ "@type": "BedDetails", numberOfBeds: b.count, typeOfBed: b.type })),
    amenityFeature: a.amenities.map((k) => ({ "@type": "LocationFeatureSpecification", name: AMENITY_NAME[k], value: true })),
    petsAllowed: false,
    // the Lupeni units are rooms of the house; Pink Panther is across town
    ...(a.inHouse ? { containedInPlace: { "@id": BUSINESS_ID } } : { sameAs: [a.bookingUrl] }),
  };
  const business = {
    "@type": "LodgingBusiness",
    "@id": BUSINESS_ID,
    name: "Serenity Apartments",
    url: `${SITE_URL}/${lang}`,
    address: lupeniAddress,
    ...telephone,
    ...(fromPrice ? { makesOffer: [offer(lang, slug, fromPrice)] } : {}),
  };
  return { "@context": "https://schema.org", "@graph": [apartment, business] };
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
