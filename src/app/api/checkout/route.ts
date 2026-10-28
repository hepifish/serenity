import { NextResponse } from "next/server";
import { z } from "zod";
import { APARTMENTS, APARTMENT_SLUGS } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { attachPayment, createPendingGroup, markFailed } from "@/lib/bookings";
import { startPayment } from "@/lib/netopia";
import { getRate, quote, type Quote } from "@/lib/pricing";
import { checkStay, splitGuests } from "@/lib/stay";
import { acceptanceOf, checkoutStatement } from "@/lib/terms";

const Body = z.object({
  apartments: z.array(z.enum(APARTMENT_SLUGS)).min(1).max(APARTMENT_SLUGS.length),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  country: z.string().trim().min(2).max(60),
  note: z.string().trim().max(1000).optional(),
  payMethod: z.enum(["card", "voucher"]),
  lang: z.enum(["en", "ro", "de"]),
  acceptTerms: z.literal(true),
  // honeypot: people never see it, bots fill it
  website: z.string().max(0).optional(),
});

function fail(code: string, status = 400) {
  return NextResponse.json({ error: code }, { status });
}

/** One payment for one or several apartments over the same dates. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("invalid");
  const b = parsed.data;
  const slugs = [...new Set(b.apartments)];
  if (slugs.some((s) => APARTMENTS[s].comingSoon)) return fail("invalid");
  const split = splitGuests(slugs, b.guests);
  if (!split) return fail("guests");

  const quotes: Quote[] = [];
  for (const [i, slug] of slugs.entries()) {
    const rate = await getRate(slug);
    if (!rate) return fail("no_price", 409);
    const stayError = checkStay(slug, b.checkIn, b.checkOut, split[i], rate.min_nights);
    if (stayError) return fail(stayError);
    const q = await quote(slug, b.checkIn, b.checkOut, split[i]);
    if (!q) return fail("no_price", 409);
    quotes.push(q);
  }

  // Read Booking.com live: this is the moment money is about to move.
  try {
    const free = await Promise.all(slugs.map((s) => isStayFree(s, b.checkIn, b.checkOut, { fresh: true })));
    if (free.includes(false)) return fail("taken", 409);
  } catch (e) {
    console.error("[checkout] calendar unavailable", e);
    return fail("calendar_unavailable", 503);
  }

  const rows = await createPendingGroup(quotes, {
    name: b.name, email: b.email, phone: b.phone, country: b.country, note: b.note, lang: b.lang, payMethod: b.payMethod,
  }, acceptanceOf(req, b.lang, checkoutStatement(b.lang)));
  if (!rows) return fail("taken", 409);
  const group = rows[0];
  const total = Math.round(quotes.reduce((s, q) => s + q.total, 0) * 100) / 100;

  // Netopia calls back the deployment that started the payment (production, a preview, or localhost).
  const origin = new URL(req.url).origin;
  const back = `${origin}/${b.lang}/booking/${group.group_ref}?t=${group.access_token}`;
  const [firstName, ...rest] = b.name.split(/\s+/);
  try {
    const { ntpId, paymentUrl } = await startPayment({
      orderId: group.group_id,
      amount: total,
      description: `Serenity ${slugs.map((s) => APARTMENTS[s].name).join(" + ")} ${b.checkIn} - ${b.checkOut} (${group.group_ref})`,
      lang: b.lang,
      notifyUrl: `${origin}/api/netopia/ipn`,
      redirectUrl: back,
      cancelUrl: back,
      billing: { email: b.email, phone: b.phone, firstName, lastName: rest.join(" ") || firstName, countryName: b.country },
      products: quotes.flatMap((q) => [
        { name: `${APARTMENTS[q.apartment as keyof typeof APARTMENTS].name}, ${q.nights} nights`, code: q.apartment, price: q.lodging },
        ...(q.cleaning ? [{ name: "Cleaning", code: `${q.apartment}-cleaning`, price: q.cleaning }] : []),
        { name: "Sibiu tourism promotion tax", code: `${q.apartment}-tax`, price: q.cityTax },
      ]),
    });
    await attachPayment(group.group_id, ntpId);
    return NextResponse.json({ paymentUrl, ref: group.group_ref });
  } catch (e) {
    console.error("[checkout] payment start failed", e);
    await markFailed(group.group_id, e instanceof Error ? e.message : "start failed");
    return fail("payment_unavailable", 502);
  }
}
