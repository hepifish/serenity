import { safeEqual } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

/**
 * Daily Vercel Cron (vercel.json). Keeps what the privacy policy promises:
 * booking and check-in records 10 years (accounting law), unpaid booking
 * attempts 90 days, rate-limit counters 1 day. Contact messages are never
 * stored, only emailed.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || !safeEqual(req.headers.get("authorization") ?? "", `Bearer ${secret}`)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const deleted = await sql.begin(async (tx) => {
    const unpaid = await tx`delete from bookings where status in ('pending','failed','expired')
      and created_at < now() - interval '90 days' and hold_until < now()`;
    const old = await tx`delete from bookings where check_out < current_date - interval '10 years'`;
    const checkins = await tx`delete from checkins where arrival < current_date - interval '10 years'`;
    const hits = await tx`delete from rate_hits where at < now() - interval '1 day'`;
    return { unpaid: unpaid.count, bookings: old.count, checkins: checkins.count, rateHits: hits.count };
  });
  console.log("[retention]", deleted);
  return Response.json(deleted, { headers: { "Cache-Control": "no-store" } });
}
