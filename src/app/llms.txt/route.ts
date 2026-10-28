import { apartmentList } from "@/lib/apartments";
import { apartmentCopy } from "@/i18n/apartments";
import { fromPrice } from "@/lib/pricing";
import { addDays, todayInSibiu } from "@/lib/dates";
import { ADDRESS, COMPANY, SITE_URL } from "@/lib/site";
import { getDict } from "@/i18n";

// A plain-text brief for AI assistants (llmstxt.org): who we are, what we
// offer, the facts people ask about. Answers drawn from the same copy as the site.
export const revalidate = 86400;

const BOOKING_NAME: Record<string, string> = { "pink-panther": "Feel Like Home Pink Panther Apartment" };

export async function GET() {
  const t = getDict("en");
  const today = todayInSibiu();
  const apartments = apartmentList();
  const prices = await Promise.all(apartments.map((a) => (a.comingSoon ? null : fromPrice(a.slug, addDays(today, 1), addDays(today, 90)).catch(() => null))));
  const lupeni = `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.city}, Romania`;

  const lines = [
    "# Serenity Apartments Sibiu",
    "",
    `> ${t.meta.description}`,
    "",
    "## Facts",
    "- City: Sibiu, Transylvania, Romania. Sibiu is called Hermannstadt in German (Nagyszeben in Hungarian).",
    `- Two addresses. Film Studio, Gothic Chambers and Art Station: ${lupeni}, a 19th-century house that served as a hospital in the Second World War; ground-floor apartments with private entrances, 1.3 km (about 20 min on foot) from Piața Mare, 900 m from the train station, 5 km from Sibiu airport. Pink Panther: Magnolia Residence, west Sibiu, an upper floor with a lift, about 5 km (10 min by car) from the old town.`,
    "- Guest rating: 8.9/10 from 253 verified reviews of Serenity House Apartments on Booking.com (staff 9.3, value 9.1, cleanliness 9.0, location 9.0).",
    "- Check-in from 15:00 (self check-in with a key box), check-out until 11:00. Free parking at both addresses. Free Wi-Fi. No pets, no smoking, no parties.",
    "- Direct booking on this website: our best price (no platform commission). Payment by card, Apple Pay, Google Pay or Romanian holiday voucher card (card de vacanță: Edenred, Up, Pluxee) through NETOPIA Payments.",
    "- Price shown with cleaning fee (once per stay) and Sibiu's 2% tourism promotion tax as separate lines.",
    "- Cancellation: free up to 7 days before arrival.",
    "- Languages: English, Romanian, German.",
    `- Operator: ${COMPANY.name}, CUI ${COMPANY.cui}, since 2022. Contact: ${COMPANY.email}${COMPANY.phone ? `, ${COMPANY.phone.display}` : ""}`,
    "",
    "## Apartments",
    ...apartments.map((a, i) => {
      const c = apartmentCopy("en", a.slug);
      const facts = a.comingSoon
        ? "coming soon"
        : `up to ${a.maxGuests} guests, ${a.bedrooms} bedroom${a.bedrooms > 1 ? "s" : ""}${a.sizeM2 ? `, ${a.sizeM2} m²` : ""}${prices[i] ? `, from ${prices[i]} RON / night` : ""}`;
      const where = `${a.address.streetAddress}, ${a.toCentre.km} km to Piața Mare, ${a.toCentre.minutes} min ${a.toCentre.by === "foot" ? "on foot" : "by car"}`;
      const aka = BOOKING_NAME[a.slug] ? ` Listed on Booking.com as "${BOOKING_NAME[a.slug]}".` : "";
      return `- [${a.name}](${SITE_URL}/en/apartments/${a.slug}) ([RO](${SITE_URL}/ro/apartments/${a.slug}), [DE](${SITE_URL}/de/apartments/${a.slug})): ${c.tagline}. ${c.intro} (${facts}; ${where}).${aka}`;
    }),
    "",
    "## Pages",
    `- [Home (English)](${SITE_URL}/en) · [Română](${SITE_URL}/ro) · [Deutsch](${SITE_URL}/de)`,
    `- [Terms](${SITE_URL}/en/terms) · [Privacy](${SITE_URL}/en/privacy)`,
    "",
    "## FAQ",
    ...t.faq.items.flatMap((f) => [`### ${f.q}`, f.a, ""]),
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
