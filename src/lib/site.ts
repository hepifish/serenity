// Facts about the business that appear on every page and in the legal texts.
// Source: ANAF public registry, checked 2026-10-28.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.serenityapartments.ro";

export const COMPANY = {
  name: "Serenity Admin Apartamente SRL",
  cui: "47339489", // not VAT registered, so no "RO" prefix
  regCom: "J32/2691/2022",
  address: "Fundătura Lupeni nr. 2, 550205 Sibiu, România",
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
