import { NextResponse } from "next/server";
import { APARTMENTS, APARTMENT_SLUGS } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { getRate, quote } from "@/lib/pricing";
import { checkStay } from "@/lib/stay";

/**
 * "Which apartments are free for my dates?" One answer per apartment with its
 * total and size. Party size is the browser's job: a group too big for one
 * apartment can still combine two.
 */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const checkIn = u.searchParams.get("in");
  const checkOut = u.searchParams.get("out");
  const results = await Promise.all(
    APARTMENT_SLUGS.map(async (slug) => {
      const capacity = APARTMENTS[slug].maxGuests;
      if (APARTMENTS[slug].comingSoon) return { slug, capacity, available: false, reason: "no_price" };
      const rate = await getRate(slug);
      if (!rate) return { slug, capacity, available: false, reason: "no_price" };
      const error = checkStay(slug, checkIn, checkOut, 1, rate.min_nights);
      if (error) return { slug, capacity, available: false, reason: error, minNights: rate.min_nights };
      const free = await isStayFree(slug, checkIn!, checkOut!).catch(() => false);
      if (!free) return { slug, capacity, available: false, reason: "taken" };
      const q = await quote(slug, checkIn!, checkOut!, 1, rate);
      return { slug, capacity, available: true, nights: q!.nights, lodging: q!.lodging, cleaning: q!.cleaning, cityTax: q!.cityTax, total: q!.total };
    }),
  );
  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
