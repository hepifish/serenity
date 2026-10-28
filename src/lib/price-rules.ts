// The price of a night, as pure rules: no database, so the server (pricing.ts)
// and the admin's live preview compute the very same numbers.
//
//   special date  >  season  >  base rate
//
// On a Friday or Saturday night the winning layer's weekend price applies
// when it has one. The minimum stay of a stay is the one of its arrival night,
// falling back the same way: special, season, base.

import { addDays, isWeekendNight, type ISODate } from "./dates";

export type PeriodKind = "season" | "special";

export type BaseRate = { base_price: number; weekend_price: number | null; min_nights: number };

export type Period = {
  id: number;
  apartment: string;
  kind: PeriodKind;
  label: string | null;
  first_night: ISODate;
  last_night: ISODate; // inclusive
  yearly: boolean;
  price: number;
  weekend_price: number | null;
  min_nights: number | null;
};

export type NightRule = { night: ISODate; price: number; minNights: number; period: Period | null };

/** Does a period price this night? A yearly one matches its days every year from its first year on. */
export function covers(p: Pick<Period, "first_night" | "last_night" | "yearly">, night: ISODate): boolean {
  if (night < p.first_night) return false;
  if (!p.yearly) return night <= p.last_night;
  const md = night.slice(5), from = p.first_night.slice(5), to = p.last_night.slice(5);
  return from <= to ? md >= from && md <= to : md >= from || md <= to; // a winter season wraps the new year
}

export function nightRule(rate: BaseRate, periods: Period[], night: ISODate): NightRule {
  const special = periods.find((p) => p.kind === "special" && covers(p, night)) ?? null;
  const season = periods.find((p) => p.kind === "season" && covers(p, night)) ?? null;
  const p = special ?? season;
  const weekend = isWeekendNight(night);
  const price = p ? (weekend ? p.weekend_price ?? p.price : p.price) : weekend ? rate.weekend_price ?? rate.base_price : rate.base_price;
  return { night, price, minNights: special?.min_nights ?? season?.min_nights ?? rate.min_nights, period: p };
}

/** The first night two periods would both price, or null. Yearly ones are followed for two years. */
export function firstOverlap(a: Period, b: Period): ISODate | null {
  const start = a.first_night > b.first_night ? a.first_night : b.first_night;
  const horizon = addDays(start, 731);
  const endA = a.yearly ? horizon : a.last_night, endB = b.yearly ? horizon : b.last_night;
  const end = endA < endB ? endA : endB;
  for (let d = start; d <= end; d = addDays(d, 1)) if (covers(a, d) && covers(b, d)) return d;
  return null;
}

/** Periods of the same apartment and kind that a new or edited period would collide with. */
export function conflictsWith(candidate: Period, existing: Period[]): Period[] {
  return existing.filter((p) => p.id !== candidate.id && p.apartment === candidate.apartment && p.kind === candidate.kind && firstOverlap(candidate, p) !== null);
}
