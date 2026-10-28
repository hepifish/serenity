import { sql } from "./db";
import { addDays, eachNight, isISODate, nightsBetween, type ISODate } from "./dates";
import { nightRule, type NightRule, type Period } from "./price-rules";
import { CITY_TAX } from "./site";
import type { ApartmentSlug } from "./apartments";
import { checkStay, splitGuests, type StayError } from "./stay";

export type Rate = { apartment: string; base_price: number; weekend_price: number | null; min_nights: number; cleaning_fee: number };
export type NightPrice = { night: ISODate; price: number };
export type Quote = {
  apartment: string;
  checkIn: ISODate;
  checkOut: ISODate;
  guests: number;
  nights: number;
  nightly: NightPrice[];
  lodging: number;
  cleaning: number;
  cityTax: number;
  total: number;
  minNights: number;
};

export async function getRate(apartment: string): Promise<Rate | null> {
  const [r] = await sql<Rate[]>`select apartment, base_price, weekend_price, min_nights, cleaning_fee from rates where apartment = ${apartment}`;
  return r ?? null;
}

const periodColumns = () => sql`id::int, apartment, kind, label, to_char(first_night, 'YYYY-MM-DD') as first_night,
  to_char(last_night, 'YYYY-MM-DD') as last_night, yearly, price, weekend_price, min_nights`;

/** The seasons and special dates of one apartment that can touch [from, to); all of them without a window. */
export async function getPeriods(apartment: string, from?: ISODate, to?: ISODate): Promise<Period[]> {
  if (!from || !to) return sql<Period[]>`select ${periodColumns()} from rate_periods where apartment = ${apartment} order by first_night, id`;
  return sql<Period[]>`select ${periodColumns()} from rate_periods
    where apartment = ${apartment} and first_night < ${to} and (yearly or last_night >= ${from}) order by first_night, id`;
}

/** Price and minimum stay of every night in [from, to), by the rules in price-rules.ts. */
export async function nightRules(apartment: string, from: ISODate, to: ISODate, known?: Rate): Promise<NightRule[]> {
  const rate = known ?? (await getRate(apartment));
  if (!rate) return [];
  const periods = await getPeriods(apartment, from, to);
  return eachNight(from, to).map((night) => nightRule(rate, periods, night));
}

export async function nightlyPrices(apartment: string, from: ISODate, to: ISODate, known?: Rate): Promise<NightPrice[]> {
  return (await nightRules(apartment, from, to, known)).map(({ night, price }) => ({ night, price }));
}

/** The shortest stay allowed for an arrival on this night. */
export async function minNightsOn(apartment: string, arrival: ISODate, known?: Rate): Promise<number> {
  const [r] = await nightRules(apartment, arrival, addDays(arrival, 1), known);
  return r?.minNights ?? known?.min_nights ?? 1;
}

/** Sibiu taxes the whole accommodation service, cleaning included, as Booking.com does. */
export function cityTaxFor(accommodation: number, guests: number, nights: number): number {
  const raw = CITY_TAX.kind === "percent" ? (accommodation * CITY_TAX.value) / 100 : CITY_TAX.value * guests * nights;
  return Math.round(raw * 100) / 100;
}

/** The server's price, always recomputed: a price sent by the browser is never trusted. */
export async function quote(apartment: string, checkIn: ISODate, checkOut: ISODate, guests: number, known?: Rate): Promise<Quote | null> {
  const rate = known ?? (await getRate(apartment));
  if (!rate) return null;
  const rules = await nightRules(apartment, checkIn, checkOut, rate);
  const nightly = rules.map(({ night, price }) => ({ night, price }));
  const lodging = nightly.reduce((s, n) => s + n.price, 0);
  const nights = nightsBetween(checkIn, checkOut);
  const cleaning = rate.cleaning_fee;
  const cityTax = cityTaxFor(lodging + cleaning, guests, nights);
  return {
    apartment, checkIn, checkOut, guests, nights, nightly, lodging, cleaning, cityTax,
    total: Math.round((lodging + cleaning + cityTax) * 100) / 100,
    minNights: rules[0]?.minNights ?? rate.min_nights,
  };
}

/**
 * Checkout's one pipeline, for one apartment or several over the same dates:
 * split the party, check each stay's rules, price it. Availability is the
 * caller's, since checkout reads Booking.com live and the page does not.
 */
export async function quoteStays(slugs: ApartmentSlug[], checkIn: unknown, checkOut: unknown, guests: number): Promise<{ quotes: Quote[]; split: number[] } | { error: StayError | "no_price" }> {
  const split = splitGuests(slugs, guests);
  if (!split) return { error: "guests" };
  const quotes: Quote[] = [];
  for (const [i, slug] of slugs.entries()) {
    const rate = await getRate(slug);
    if (!rate) return { error: "no_price" };
    const minNights = isISODate(checkIn) ? await minNightsOn(slug, checkIn, rate) : 1;
    const error = checkStay(slug, checkIn, checkOut, split[i], minNights);
    if (error) return { error };
    quotes.push((await quote(slug, checkIn as ISODate, checkOut as ISODate, split[i], rate))!);
  }
  return { quotes, split };
}

/** The lowest nightly price in the coming months, for "from … / night". */
export async function fromPrice(apartment: string, from: ISODate, to: ISODate): Promise<number | null> {
  const prices = await nightlyPrices(apartment, from, to);
  return prices.length ? Math.min(...prices.map((p) => p.price)) : null;
}
