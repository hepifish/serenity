import { sql } from "./db";
import { eachNight, isWeekendNight, nightsBetween, type ISODate } from "./dates";
import { CITY_TAX } from "./site";

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

/** Nightly prices for a date window: the override if one is set, else the weekday or weekend rate. */
export async function nightlyPrices(apartment: string, from: ISODate, to: ISODate): Promise<NightPrice[]> {
  const rate = await getRate(apartment);
  if (!rate) return [];
  const rows = await sql<{ night: string; price: number }[]>`
    select to_char(night, 'YYYY-MM-DD') as night, price from rate_overrides
    where apartment = ${apartment} and night >= ${from} and night < ${to}`;
  const overrides = new Map(rows.map((r) => [r.night, r.price]));
  return eachNight(from, to).map((night) => ({
    night,
    price: overrides.get(night) ?? (isWeekendNight(night) ? rate.weekend_price ?? rate.base_price : rate.base_price),
  }));
}

/** Sibiu taxes the whole accommodation service, cleaning included, as Booking.com does. */
export function cityTaxFor(accommodation: number, guests: number, nights: number): number {
  const raw = CITY_TAX.kind === "percent" ? (accommodation * CITY_TAX.value) / 100 : CITY_TAX.value * guests * nights;
  return Math.round(raw * 100) / 100;
}

/** The server's price, always recomputed: a price sent by the browser is never trusted. */
export async function quote(apartment: string, checkIn: ISODate, checkOut: ISODate, guests: number): Promise<Quote | null> {
  const rate = await getRate(apartment);
  if (!rate) return null;
  const nightly = await nightlyPrices(apartment, checkIn, checkOut);
  const lodging = nightly.reduce((s, n) => s + n.price, 0);
  const nights = nightsBetween(checkIn, checkOut);
  const cleaning = rate.cleaning_fee;
  const cityTax = cityTaxFor(lodging + cleaning, guests, nights);
  return {
    apartment, checkIn, checkOut, guests, nights, nightly, lodging, cleaning, cityTax,
    total: Math.round((lodging + cleaning + cityTax) * 100) / 100,
    minNights: rate.min_nights,
  };
}

/** The lowest nightly price in the coming months, for "from … / night". */
export async function fromPrice(apartment: string, from: ISODate, to: ISODate): Promise<number | null> {
  const prices = await nightlyPrices(apartment, from, to);
  return prices.length ? Math.min(...prices.map((p) => p.price)) : null;
}
