// Facts about the business that appear on every page and in the legal texts.
// Source: ANAF public registry, checked 2026-10-28.

/** The canonical origin is the apex domain; www redirects here (next.config.ts). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://serenityapartments.ro").replace(/\/$/, "");

/**
 * The house at Lupeni, written once for the footer, the legal pages, the
 * structured data and llms.txt. Postcode from Poșta Română's lookup: 550206 is
 * Strada Fundătura Lupeni (550205, in the ANAF record, is Strada Lupeni).
 */
export const ADDRESS = {
  street: "Fundătura Lupeni 2",
  postalCode: "550206",
  city: "Sibiu",
  region: "Sibiu",
  country: "RO",
};

/** When the public copy last changed: the sitemap's lastModified. Bump it with copy edits. */
export const CONTENT_UPDATED = "2026-10-28";

export type Phone ={ display: string; tel: string };

export const COMPANY = {
  name: "Serenity Admin Apartamente SRL",
  cui: "47339489", // not VAT registered, so no "RO" prefix
  regCom: "J32/2691/2022",
  address: `Fundătura Lupeni nr. 2, ${ADDRESS.postalCode} ${ADDRESS.city}, România`,
  /** On the RoTLD domain record and the city-tax declaration. Set to null to hide it everywhere. */
  phone: { display: "+40 749 061 490", tel: "+40749061490" } as Phone | null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "serenityhouseap@gmail.com",
  // TODO(Pati): classification certificate number from the Ministry of Tourism
  classification: null as string | null,
};

/**
 * Sibiu's tourism promotion tax ("taxa specială pentru promovarea turistică",
 * HCL 462/2025, in force since 2026-01-01): 2% of the accommodation value.
 * Shown as its own line at checkout, never folded into the nightly price.
 */
export const CITY_TAX = { kind: "percent" as "percent" | "fixed", value: 2 };

/** How long an unpaid booking keeps its nights while the guest is on the payment page. */
export const HOLD_MINUTES = 20;

/** Direct bookings need this much notice, so Booking.com has time to read our calendar. */
export const MIN_LEAD_DAYS = 1;

/** How far ahead the calendar lets guests book. */
export const MAX_AHEAD_DAYS = 180;
