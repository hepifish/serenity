import { apartmentList } from "@/lib/apartments";
import { apartmentCopy } from "@/i18n/apartments";
import { COMPANY, SITE_URL } from "@/lib/site";
import { getDict } from "@/i18n";

// A plain-text brief for AI assistants (llmstxt.org): who we are, what we
// offer, the facts people ask about. Answers drawn from the same copy as the site.
export const revalidate = 86400;

export function GET() {
  const t = getDict("en");
  const lines = [
    "# Serenity Apartments Sibiu",
    "",
    `> ${t.meta.description}`,
    "",
    "## Facts",
    `- Address: Fundătura Lupeni 2, 550206 Sibiu, Romania. 1.3 km (about 20 min walk) from Piața Mare, 900 m from the train station, 5 km from Sibiu airport.`,
    "- Building: 19th-century house, used as a hospital in the Second World War. Ground-floor apartments with private entrances.",
    "- Guest rating: 8.9/10 from 253 verified reviews on Booking.com (staff 9.3, value 9.1, cleanliness 9.0, location 9.0).",
    "- Check-in from 15:00 (self check-in with key box), check-out until 11:00. Free parking (street and a small locked garage). Free Wi-Fi. No pets, no smoking, no parties.",
    "- Direct booking on this website: our best price (no platform commission). Payment by card, Apple Pay, Google Pay or Romanian holiday voucher card (card de vacanță: Edenred, Up, Pluxee) through NETOPIA Payments.",
    "- Price shown with cleaning fee (once per stay) and Sibiu's 2% tourism promotion tax as separate lines.",
    "- Cancellation: free up to 7 days before arrival.",
    "- Languages: English, Romanian, German.",
    `- Operator: ${COMPANY.name}, CUI ${COMPANY.cui}. Contact: ${COMPANY.email}`,
    "",
    "## Apartments",
    ...apartmentList().map((a) => {
      const c = apartmentCopy("en", a.slug);
      const facts = a.comingSoon ? "coming soon" : `up to ${a.maxGuests} guests, ${a.bedrooms} bedroom${a.sizeM2 ? `, ${a.sizeM2} m²` : ""}`;
      return `- [${a.name}](${SITE_URL}/en/apartments/${a.slug}): ${c.tagline}. ${c.intro} (${facts})`;
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
