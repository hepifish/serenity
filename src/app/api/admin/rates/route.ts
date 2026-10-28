import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-auth";
import { APARTMENT_SLUGS } from "@/lib/apartments";
import { sql } from "@/lib/db";

const Body = z.object({
  apartment: z.enum(APARTMENT_SLUGS),
  base_price: z.number().int().min(1).max(100000),
  weekend_price: z.number().int().min(1).max(100000).nullable(),
  min_nights: z.number().int().min(1).max(30),
  cleaning_fee: z.number().int().min(0).max(10000),
});

/** The defaults of one apartment: everyday price, Friday/Saturday price, shortest stay, cleaning. */
export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const r = parsed.data;
  await sql`insert into rates (apartment, base_price, weekend_price, min_nights, cleaning_fee)
            values (${r.apartment}, ${r.base_price}, ${r.weekend_price}, ${r.min_nights}, ${r.cleaning_fee})
            on conflict (apartment) do update set base_price = excluded.base_price, weekend_price = excluded.weekend_price,
              min_nights = excluded.min_nights, cleaning_fee = excluded.cleaning_fee, updated_at = now()`;
  return NextResponse.json({ ok: true });
}
