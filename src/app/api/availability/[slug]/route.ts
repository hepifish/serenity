import { NextResponse } from "next/server";
import { isApartmentSlug } from "@/lib/apartments";
import { unavailableNights } from "@/lib/availability";
import { addDays, todayInSibiu } from "@/lib/dates";
import { getRate, nightRules } from "@/lib/pricing";
import { CITY_TAX, MAX_AHEAD_DAYS, MIN_LEAD_DAYS } from "@/lib/site";

/** What the apartment calendar needs: busy nights and a price for every free one. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isApartmentSlug(slug)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const today = todayInSibiu();
  const from = addDays(today, MIN_LEAD_DAYS);
  const to = addDays(today, MAX_AHEAD_DAYS);
  const [rate, busy] = await Promise.all([getRate(slug), unavailableNights(slug).catch(() => null)]);
  const rules = rate ? await nightRules(slug, from, to, rate) : [];
  if (!busy) return NextResponse.json({ error: "calendar_unavailable" }, { status: 503 });
  return NextResponse.json(
    {
      today: from,
      maxDate: to,
      minNights: rate?.min_nights ?? 1,
      cleaningFee: rate?.cleaning_fee ?? 0,
      cityTaxPercent: CITY_TAX.kind === "percent" ? CITY_TAX.value : 0,
      busy: [...busy].filter((d) => d >= today).sort(),
      prices: Object.fromEntries(rules.map((r) => [r.night, r.price])),
      // arrivals whose season or special date asks for another minimum stay
      minStay: Object.fromEntries(rules.filter((r) => r.minNights !== rate?.min_nights).map((r) => [r.night, r.minNights])),
    },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
