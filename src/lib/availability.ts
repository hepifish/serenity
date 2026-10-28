import { sql } from "./db";
import { busyNights, parseIcal } from "./ical";
import { eachNight, type ISODate } from "./dates";
import { APARTMENTS, type ApartmentSlug } from "./apartments";

/**
 * The truth about a night lives in the channels (each one's iCal export per
 * room: Booking.com, and Airbnb for Pink Panther) and our own bookings table.
 * A night is free only when all of them agree.
 *
 * Channel feeds are cached for a short while for browsing; anything that
 * takes money calls with fresh=true and reads it live.
 */
const CACHE_MS = 3 * 60_000;
const MAX_ICAL_BYTES = 2_000_000;
const cache = new Map<string, { at: number; nights: Set<ISODate> }>();

/** One channel's calendar (Booking.com, Airbnb): its iCal export, cached briefly for browsing. */
async function channelNights(envName: string, fresh: boolean): Promise<Set<ISODate>> {
  const url = process.env[envName];
  if (!url) return new Set();
  const hit = cache.get(envName);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.nights;
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`${envName} calendar answered ${res.status}`);
  // A real feed is a few KB; refuse anything that could eat the function's memory.
  if (Number(res.headers.get("content-length") ?? 0) > MAX_ICAL_BYTES) throw new Error(`${envName} calendar is too large`);
  const text = await res.text();
  if (text.length > MAX_ICAL_BYTES) throw new Error(`${envName} calendar is too large`);
  const nights = busyNights(parseIcal(text));
  cache.set(envName, { at: Date.now(), nights });
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
  const sets = await Promise.all([
    ...APARTMENTS[slug].icalEnvs.map((env) => channelNights(env, !!opts.fresh)),
    directNights(slug, opts.exceptBooking),
  ]);
  return new Set(sets.flatMap((s) => [...s]));
}

export async function isStayFree(slug: ApartmentSlug, checkIn: ISODate, checkOut: ISODate, opts: { fresh?: boolean; exceptBooking?: string } = {}) {
  const busy = await unavailableNights(slug, opts);
  return eachNight(checkIn, checkOut).every((n) => !busy.has(n));
}
