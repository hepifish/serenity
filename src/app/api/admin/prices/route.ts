import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDenied } from "@/lib/admin-auth";
import { APARTMENT_SLUGS, APARTMENTS } from "@/lib/apartments";
import { unavailableNights } from "@/lib/availability";
import { addDays, isISODate, todayInSibiu } from "@/lib/dates";
import { MAX_AHEAD_DAYS } from "@/lib/site";
import { sql } from "@/lib/db";
import { getPeriods, getRate, type Rate } from "@/lib/pricing";
import { conflictsWith, type Period } from "@/lib/price-rules";

export type PriceBook = {
  today: string;
  rows: { slug: string; name: string; accent: string; rate: Rate | null; periods: Period[]; busy: string[] }[];
};

/** Everything the price manager draws: per apartment its base rate, its periods and its booked nights. */
export async function GET(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const today = todayInSibiu();
  // only nights the site can sell: Booking.com reports everything past its open calendar as closed
  const until = addDays(today, MAX_AHEAD_DAYS);
  const rows = await Promise.all(
    APARTMENT_SLUGS.filter((s) => !APARTMENTS[s].comingSoon).map(async (slug) => {
      const [rate, periods, busy] = await Promise.all([getRate(slug), getPeriods(slug), unavailableNights(slug).catch(() => new Set<string>())]);
      return { slug, name: APARTMENTS[slug].name, accent: APARTMENTS[slug].accent, rate, periods, busy: [...busy].filter((d) => d >= today && d <= until).sort() };
    }),
  );
  return NextResponse.json({ today, rows } satisfies PriceBook, { headers: { "Cache-Control": "no-store" } });
}

const Fields = z
  .object({
    kind: z.enum(["season", "special"]),
    label: z.string().trim().max(60).nullable(),
    first_night: z.string().refine(isISODate),
    last_night: z.string().refine(isISODate),
    yearly: z.boolean(),
    price: z.number().int().min(1).max(100000),
    weekend_price: z.number().int().min(1).max(100000).nullable(),
    min_nights: z.number().int().min(1).max(30).nullable(),
  })
  .refine((f) => f.last_night >= f.first_night, "order")
  .refine((f) => !f.yearly || f.last_night < addDays(f.first_night, 366), "yearly");

const Create = z.object({ apartments: z.array(z.enum(APARTMENT_SLUGS)).min(1), period: Fields });
const Update = z.object({ id: z.number().int().positive(), period: Fields });

type Saved = { error: "overlap"; conflicts: Period[] } | { ok: true };

/**
 * Periods of one kind that would share a night are refused, with the ones in
 * the way, so nothing is ever silently overruled. The apartments' rate rows
 * are locked first, so two saves cannot both slip past the check.
 */
async function save(apartments: string[], fields: z.infer<typeof Fields>, id?: number): Promise<Saved> {
  const f = { ...fields, label: fields.label || null };
  return sql.begin(async (tx) => {
    await tx`select apartment from rates where apartment = any(${apartments}) for update`;
    const conflicts: Period[] = [];
    for (const apartment of apartments) conflicts.push(...conflictsWith({ ...f, id: id ?? 0, apartment }, await getPeriods(apartment)));
    if (conflicts.length) return { error: "overlap" as const, conflicts };
    if (id) {
      await tx`update rate_periods set kind = ${f.kind}, label = ${f.label}, first_night = ${f.first_night}, last_night = ${f.last_night},
                 yearly = ${f.yearly}, price = ${f.price}, weekend_price = ${f.weekend_price}, min_nights = ${f.min_nights}, updated_at = now()
               where id = ${id}`;
    } else {
      for (const apartment of apartments) {
        await tx`insert into rate_periods (apartment, kind, label, first_night, last_night, yearly, price, weekend_price, min_nights)
                 values (${apartment}, ${f.kind}, ${f.label}, ${f.first_night}, ${f.last_night}, ${f.yearly}, ${f.price}, ${f.weekend_price}, ${f.min_nights})`;
      }
    }
    return { ok: true as const };
  });
}

function answer(r: Saved) {
  return NextResponse.json(r, { status: "error" in r ? 409 : 200 });
}

/** A new season or special date, for one apartment or several at once. */
export async function POST(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const parsed = Create.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  return answer(await save(parsed.data.apartments, parsed.data.period));
}

/** Changes one period in place; it stays on its apartment. */
export async function PATCH(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const parsed = Update.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const [row] = await sql<{ apartment: string }[]>`select apartment from rate_periods where id = ${parsed.data.id}`;
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return answer(await save([row.apartment], parsed.data.period, parsed.data.id));
}

/** Removes one period. The page keeps a copy for Undo, which simply creates it again. */
export async function DELETE(req: Request) {
  const denied = adminDenied(req);
  if (denied) return denied;
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const rows = await sql`delete from rate_periods where id = ${id} returning id`;
  return rows.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "not_found" }, { status: 404 });
}
