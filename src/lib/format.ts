import type { ISODate } from "./dates";

export function money(n: number, lang: string, decimals = false) {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : lang, {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(n) + " RON";
}

export function shortDate(d: ISODate, lang: string) {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));
}

export function longDate(d: ISODate, lang: string) {
  return new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));
}

export function range(a: ISODate, b: ISODate, lang: string) {
  return `${shortDate(a, lang)} → ${shortDate(b, lang)}`;
}

export function mediumDate(d: ISODate, lang: string) {
  return new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));
}

/** Free text that ends up in a CSV cell or an email subject: no control characters, no line breaks. */
export function oneLine(s: string) {
  return s.replace(/[\u0000-\u001f\u007f]+/g, " ");
}
