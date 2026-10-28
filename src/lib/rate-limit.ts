import { sql } from "./db";
import type { Booking } from "./bookings";

/**
 * Abuse limits kept in Postgres (sql/005): no Redis, and they hold across
 * every serverless instance. The daily retention cron clears old hits.
 */

/** The caller's IP as Vercel reports it; one shared bucket when run locally. */
export function clientIp(req: Request): string {
  return req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}

/** Counts this request and says whether the IP has gone past `max` in the last `windowS` seconds. */
export async function overLimit(req: Request, bucket: string, max: number, windowS: number): Promise<boolean> {
  const ip = clientIp(req);
  const [{ n }] = await sql<{ n: number }[]>`
    with hit as (insert into rate_hits (bucket, ip) values (${bucket}, ${ip}))
    select count(*)::int as n from rate_hits
    where bucket = ${bucket} and ip = ${ip} and at > now() - make_interval(secs => ${windowS})`;
  return n + 1 > max; // the select does not see its own insert
}

/** Route handlers: a 429 the forms understand, or null to go on. */
export async function rateLimited(req: Request, bucket: string, max: number, windowS: number): Promise<Response | null> {
  return (await overLimit(req, bucket, max, windowS)) ? Response.json({ error: "too_many" }, { status: 429 }) : null;
}

/** Live unpaid holds one guest may keep at once: enough to retry a payment, not to block the calendar. */
export const MAX_LIVE_HOLDS = 2;

/**
 * Runs right after a hold is created. Tags it with the caller's IP, then counts
 * the live holds of that IP or email (this one included). Over the cap, the new
 * hold is released at once and the guest gets a 429. Counting after the insert
 * means two parallel requests see each other, so neither slips through.
 */
export async function holdCapExceeded(req: Request, group: Booking[]): Promise<Response | null> {
  const { group_id: groupId, guest_email: email } = group[0];
  const ip = clientIp(req);
  await sql`update bookings set client_ip = ${ip} where group_id = ${groupId}`;
  const [{ n }] = await sql<{ n: number }[]>`
    select count(distinct group_id)::int as n from bookings
    where status = 'pending' and hold_until > now() and (client_ip = ${ip} or lower(guest_email) = lower(${email}))`;
  if (n <= MAX_LIVE_HOLDS) return null;
  await sql`update bookings set status = 'failed', netopia_message = 'hold limit', updated_at = now() where group_id = ${groupId}`;
  return Response.json({ error: "hold_limit" }, { status: 429 });
}
