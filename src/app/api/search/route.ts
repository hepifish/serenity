import { NextResponse } from "next/server";
import { APARTMENT_SLUGS } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { getRate, quote } from "@/lib/pricing";
import { checkStay } from "@/lib/stay";

/** "Which apartment is free for my dates?" One answer per apartment, with its price. */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const checkIn = u.searchParams.get("in");
  const checkOut = u.searchParams.get("out");
  const guests = Number(u.searchParams.get("guests") ?? 2);
  const results = await Promise.all(
    APARTMENT_SLUGS.map(async (slug) => {
      const rate = await getRate(slug);
      const error = checkStay(slug, checkIn, checkOut, guests, rate?.min_nights ?? 1);
      if (error) return { slug, available: false, reason: error, minNights: rate?.min_nights ?? 1 };
      if (!rate) return { slug, available: false, reason: "no_price" };
      const free = await isStayFree(slug, checkIn!, checkOut!).catch(() => false);
      if (!free) return { slug, available: false, reason: "taken" };
      const q = await quote(slug, checkIn!, checkOut!, guests);
      return { slug, available: true, nights: q!.nights, lodging: q!.lodging, cleaning: q!.cleaning, cityTax: q!.cityTax, total: q!.total };
    }),
  );
  return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
