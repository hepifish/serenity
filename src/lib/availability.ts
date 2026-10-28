import { sql } from "./db";
import { busyNights, parseIcal } from "./ical";
import { eachNight, type ISODate } from "./dates";
import { APARTMENTS, type ApartmentSlug } from "./apartments";

/**
 * The truth about a night lives in two places: Booking.com (its iCal export
 * per room) and our own bookings table. A night is free only when both agree.
 *
 * The Booking feed is cached for a short while for browsing; anything that
 * takes money calls with fresh=true and reads it live.
 */
const CACHE_MS = 3 * 60_000;
const cache = new Map<string, { at: number; nights: Set<ISODate> }>();

async function bookingComNights(slug: ApartmentSlug, fresh: boolean): Promise<Set<ISODate>> {
  const url = process.env[APARTMENTS[slug].icalEnv];
  if (!url) return new Set();
  const hit = cache.get(slug);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.nights;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Booking.com calendar for ${slug} answered ${res.status}`);
  const nights = busyNights(parseIcal(await res.text()));
  cache.set(slug, { at: Date.now(), nights });
  return nights;
}

async function directNights(slug: ApartmentSlug, exceptBooking?: string): Promise<Set<ISODate>> {
  const rows = await sql<{ check_in: string; check_out: string }[]>`
    select to_char(check_in,'YYYY-MM-DD') as check_in, to_char(check_out,'YYYY-MM-DD') as check_out
    from bookings
    where apartment = ${slug}
      and (status = 'paid' or (status = 'pending' and hold_until > now()))
      and id::text is distinct from ${exceptBooking ?? null}`;
  const set = new Set<ISODate>();
  for (const r of rows) for (const n of eachNight(r.check_in, r.check_out)) set.add(n);
  return set;
}

export async function unavailableNights(slug: ApartmentSlug, opts: { fresh?: boolean; exceptBooking?: string } = {}) {
  const [a, b] = await Promise.all([bookingComNights(slug, !!opts.fresh), directNights(slug, opts.exceptBooking)]);
  return new Set([...a, ...b]);
}

export async function isStayFree(slug: ApartmentSlug, checkIn: ISODate, checkOut: ISODate, opts: { fresh?: boolean; exceptBooking?: string } = {}) {
  const busy = await unavailableNights(slug, opts);
  return eachNight(checkIn, checkOut).every((n) => !busy.has(n));
}
