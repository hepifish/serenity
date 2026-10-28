import { safeEqual } from "@/lib/admin-auth";
import { sql } from "@/lib/db";

/**
 * Daily Vercel Cron (vercel.json). Keeps what the privacy policy promises:
 * booking and check-in records 10 years (accounting law), terms evidence
 * 3 years after the stay, unpaid booking attempts 90 days, rate-limit
 * counters 1 day. An open claim needs its evidence file printed first. Contact messages are never
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
    // Terms evidence: 3 years after the stay (sql/004), and never longer than the booking it proves.
    const terms = await tx`delete from terms_acceptances a where
      (context = 'booking' and not exists (select 1 from bookings b where b.group_id = a.group_id and b.check_out > current_date - interval '3 years'))
      or (context = 'checkin' and not exists (select 1 from checkins c where c.id = a.checkin_id and c.arrival > current_date - interval '3 years'))`;
    const hits = await tx`delete from rate_hits where at < now() - interval '1 day'`;
    return { unpaid: unpaid.count, bookings: old.count, checkins: checkins.count, terms: terms.count, rateHits: hits.count };
  });
  console.log("[retention]", deleted);
  return Response.json(deleted, { headers: { "Cache-Control": "no-store" } });
}
