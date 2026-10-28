import { addDays, isISODate, nightsBetween, todayInSibiu, type ISODate } from "./dates";
import { APARTMENTS, type ApartmentSlug } from "./apartments";
import { MAX_AHEAD_DAYS, MIN_LEAD_DAYS } from "./site";

export const MAX_NIGHTS = 30;

export type StayError = "dates" | "too_soon" | "too_far" | "too_long" | "min_nights" | "guests";

/** The rules every stay must pass before we look at prices or calendars. */
export function checkStay(slug: ApartmentSlug, checkIn: unknown, checkOut: unknown, guests: number, minNights = 1): StayError | null {
  if (!isISODate(checkIn) || !isISODate(checkOut) || checkOut <= checkIn) return "dates";
  const today = todayInSibiu();
  if (checkIn < addDays(today, MIN_LEAD_DAYS)) return "too_soon";
  if (checkOut > addDays(today, MAX_AHEAD_DAYS)) return "too_far";
  const n = nightsBetween(checkIn as ISODate, checkOut as ISODate);
  if (n > MAX_NIGHTS) return "too_long";
  if (n < minNights) return "min_nights";
  if (!Number.isInteger(guests) || guests < 1 || guests > APARTMENTS[slug].maxGuests) return "guests";
  return null;
}
