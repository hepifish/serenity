import { NextResponse } from "next/server";
import { z } from "zod";
import { isApartmentSlug, APARTMENTS } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { attachPayment, createPendingBooking, markFailed } from "@/lib/bookings";
import { startPayment } from "@/lib/netopia";
import { getRate, quote } from "@/lib/pricing";
import { checkStay } from "@/lib/stay";

const Body = z.object({
  apartment: z.string(),
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

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("invalid");
  const b = parsed.data;
  if (!isApartmentSlug(b.apartment)) return fail("invalid");

  const rate = await getRate(b.apartment);
  if (!rate) return fail("no_price", 409);
  const stayError = checkStay(b.apartment, b.checkIn, b.checkOut, b.guests, rate.min_nights);
  if (stayError) return fail(stayError);

  // Read Booking.com live: this is the moment money is about to move.
  try {
    if (!(await isStayFree(b.apartment, b.checkIn, b.checkOut, { fresh: true }))) return fail("taken", 409);
  } catch (e) {
    console.error("[checkout] calendar unavailable", e);
    return fail("calendar_unavailable", 503);
  }

  const q = await quote(b.apartment, b.checkIn, b.checkOut, b.guests);
  if (!q) return fail("no_price", 409);

  const booking = await createPendingBooking(q, {
    name: b.name, email: b.email, phone: b.phone, country: b.country, note: b.note, lang: b.lang, payMethod: b.payMethod,
  });
  if (!booking) return fail("taken", 409);

  // Netopia calls back the deployment that started the payment (production, a preview, or localhost).
  const origin = new URL(req.url).origin;
  const back = `${origin}/${b.lang}/booking/${booking.ref}?t=${booking.access_token}`;
  const [firstName, ...rest] = b.name.split(/\s+/);
  try {
    const { ntpId, paymentUrl } = await startPayment({
      orderId: booking.id,
      amount: q.total,
      description: `Serenity ${APARTMENTS[b.apartment].name} ${q.checkIn} - ${q.checkOut} (${booking.ref})`,
      lang: b.lang,
      notifyUrl: `${origin}/api/netopia/ipn`,
      redirectUrl: back,
      cancelUrl: back,
      billing: { email: b.email, phone: b.phone, firstName, lastName: rest.join(" ") || firstName, countryName: b.country },
      products: [
        { name: `${APARTMENTS[b.apartment].name}, ${q.nights} nights`, code: b.apartment, price: q.lodging },
        ...(q.cleaning ? [{ name: "Cleaning", code: "cleaning", price: q.cleaning }] : []),
        { name: "Sibiu tourism promotion tax", code: "city-tax", price: q.cityTax },
      ],
    });
    await attachPayment(booking.id, ntpId);
    return NextResponse.json({ paymentUrl, ref: booking.ref });
  } catch (e) {
    console.error("[checkout] payment start failed", e);
    await markFailed(booking.id, e instanceof Error ? e.message : "start failed");
    return fail("payment_unavailable", 502);
  }
}
