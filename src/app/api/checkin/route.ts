import { NextResponse } from "next/server";
import { z } from "zod";
import { APARTMENT_SLUGS } from "@/lib/apartments";
import { isValidCnp } from "@/lib/cnp";
import { isISODate } from "@/lib/dates";
import { sql } from "@/lib/db";
import { sendCheckinNotice } from "@/lib/email";
import { seal } from "@/lib/seal";

const Body = z.object({
  source: z.enum(["direct", "booking", "other"]),
  reservation: z.string().trim().max(40).optional(),
  apartment: z.enum(APARTMENT_SLUGS).optional(),
  arrival: z.string().refine(isISODate),
  nights: z.number().int().min(1).max(90).optional(),
  guests: z.number().int().min(1).max(16).optional(),
  fullName: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  street: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().max(20).optional(),
  country: z.string().trim().min(2).max(60),
  cnp: z.string().trim().optional().refine((v) => !v || isValidCnp(v), "cnp"),
  companyName: z.string().trim().max(160).optional(),
  companyCui: z.string().trim().max(20).optional(),
  acceptRules: z.literal(true),
  lang: z.enum(["en", "ro", "de"]),
  website: z.string().max(0).optional(), // honeypot
});

/** Online check-in: the invoice data and the house rules, accepted before arrival. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const cnp = parsed.error.issues.some((i) => i.path[0] === "cnp");
    return NextResponse.json({ error: cnp ? "cnp" : "invalid" }, { status: 400 });
  }
  const c = parsed.data;
  const [row] = await sql<{ id: string }[]>`
    insert into checkins (source, reservation, apartment, arrival, nights, guests, full_name, email, phone, street, city,
      postal_code, country, cnp_enc, company_name, company_cui, rules_accepted_at, lang)
    values (${c.source}, ${c.reservation || null}, ${c.apartment ?? null}, ${c.arrival}, ${c.nights ?? null}, ${c.guests ?? null},
      ${c.fullName}, ${c.email}, ${c.phone || null}, ${c.street}, ${c.city}, ${c.postalCode || null}, ${c.country},
      ${c.cnp ? seal(c.cnp) : null}, ${c.companyName || null}, ${c.companyCui || null}, now(), ${c.lang})
    returning id`;
  await sendCheckinNotice({ ...c, id: row.id }).catch((e) => console.error("[checkin] notice failed", e));
  return NextResponse.json({ ok: true });
}
