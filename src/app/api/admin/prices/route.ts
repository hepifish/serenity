import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDenied } from "@/lib/admin-auth";
import { APARTMENT_SLUGS, APARTMENTS } from "@/lib/apartments";
import { unavailableNights } from "@/lib/availability";
import { eachNight, isISODate } from "@/lib/dates";
import { sql } from "@/lib/db";
import { getRate, nightlyPrices, type Rate } from "@/lib/pricing";

/** One window of the price matrix: every apartment, every night, its price and whether it is taken. */
export async function GET(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const u = new URL(req.url);
  const from = u.searchParams.get("from"), to = u.searchParams.get("to");
  if (!isISODate(from) || !isISODate(to) || to <= from) return NextResponse.json({ error: "dates" }, { status: 400 });
  const slugs = APARTMENT_SLUGS.filter((s) => !APARTMENTS[s].comingSoon);
  const rows = await Promise.all(
    slugs.map(async (slug) => {
      const [rate, prices, busy, overrides] = await Promise.all([
        getRate(slug),
        nightlyPrices(slug, from, to),
        unavailableNights(slug).catch(() => new Set<string>()),
        sql<{ night: string }[]>`select to_char(night,'YYYY-MM-DD') as night from rate_overrides where apartment = ${slug} and night >= ${from} and night < ${to}`,
      ]);
      const own = new Set(overrides.map((o) => o.night));
      return {
        slug,
        name: APARTMENTS[slug].name,
        accent: APARTMENTS[slug].accent,
        rate,
        nights: Object.fromEntries(prices.map((p) => [p.night, { price: p.price, custom: own.has(p.night), busy: busy.has(p.night) }])),
      };
    }),
  );
  return NextResponse.json({ nights: eachNight(from, to), rows }, { headers: { "Cache-Control": "no-store" } });
}

const SetPrices = z.object({
  apartments: z.array(z.enum(APARTMENT_SLUGS)).min(1),
  nights: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).min(1).max(400),
  price: z.number().int().min(1).max(100000).nullable(), // null = back to the default
});

/** Sets one price on a selection of nights, or clears them back to the default rate. */
export async function POST(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const parsed = SetPrices.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { apartments, nights, price } = parsed.data;
  await sql.begin(async (tx) => {
    for (const a of apartments) {
      if (price === null) {
        await tx`delete from rate_overrides where apartment = ${a} and night = any(${nights}::date[])`;
      } else {
        await tx`insert into rate_overrides (apartment, night, price)
                 select ${a}, unnest(${nights}::date[]), ${price}
                 on conflict (apartment, night) do update set price = excluded.price, updated_at = now()`;
      }
    }
  });
  return NextResponse.json({ ok: true, changed: apartments.length * nights.length });
}

export type PriceMatrix = {
  nights: string[];
  rows: { slug: string; name: string; accent: string; rate: Rate | null; nights: Record<string, { price: number; custom: boolean; busy: boolean }> }[];
};
