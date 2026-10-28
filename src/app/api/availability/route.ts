import { NextResponse } from "next/server";
import { apartmentList } from "@/lib/apartments";
import { unavailableNights } from "@/lib/availability";
import { addDays, todayInSibiu } from "@/lib/dates";
import { getRate, nightlyPrices } from "@/lib/pricing";
import { MAX_AHEAD_DAYS, MIN_LEAD_DAYS } from "@/lib/site";

/**
 * Every bookable apartment's calendar at once, for the home search: the
 * browser greys out a night only when none of them can take it.
 */
export async function GET() {
  const today = todayInSibiu();
  const from = addDays(today, MIN_LEAD_DAYS);
  const to = addDays(today, MAX_AHEAD_DAYS);
  const apartments = await Promise.all(
    apartmentList()
      .filter((a) => !a.comingSoon)
      .map(async (a) => {
        const [rate, busy, prices] = await Promise.all([getRate(a.slug), unavailableNights(a.slug).catch(() => null), nightlyPrices(a.slug, from, to)]);
        if (!rate || !busy) return null;
        return {
          slug: a.slug,
          minNights: rate.min_nights,
          busy: [...busy].filter((d) => d >= from).sort(),
          prices: Object.fromEntries(prices.map((p) => [p.night, p.price])),
        };
      }),
  );
  return NextResponse.json({ today: from, maxDate: to, apartments: apartments.filter(Boolean) }, { headers: { "Cache-Control": "no-store" } });
}
