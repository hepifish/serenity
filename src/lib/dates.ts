// Stays are counted in nights, and a night is named by the date it starts on.
// Everything here works on plain "YYYY-MM-DD" strings in UTC arithmetic, so a
// guest's browser timezone can never shift a date by one.

export type ISODate = string;

const DAY = 86_400_000;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(s: unknown): s is ISODate {
  return typeof s === "string" && ISO.test(s) && !Number.isNaN(Date.parse(s + "T00:00:00Z"));
}

export function toDate(d: ISODate): Date {
  return new Date(d + "T00:00:00Z");
}

export function fromDate(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function addDays(d: ISODate, n: number): ISODate {
  return fromDate(new Date(toDate(d).getTime() + n * DAY));
}

export function nightsBetween(checkIn: ISODate, checkOut: ISODate): number {
  return Math.round((toDate(checkOut).getTime() - toDate(checkIn).getTime()) / DAY);
}

/** Every night of a stay: check-in inclusive, check-out exclusive. */
export function eachNight(checkIn: ISODate, checkOut: ISODate): ISODate[] {
  const out: ISODate[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Today on the apartments' own clock, not the server's. */
export function todayInSibiu(): ISODate {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Bucharest" }).format(new Date());
}

/** Friday and Saturday nights carry the weekend rate. */
export function isWeekendNight(d: ISODate): boolean {
  const day = toDate(d).getUTCDay();
  return day === 5 || day === 6;
}
