import { addDays, eachNight, isISODate, type ISODate } from "./dates";

export type Busy = { start: ISODate; end: ISODate; summary?: string };

/**
 * Reads the all-day events out of an iCal feed (Booking.com exports one per
 * room). Only what we need: start, end, summary. Lines folded per RFC 5545
 * are unfolded first.
 */
export function parseIcal(text: string): Busy[] {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events: Busy[] = [];
  let cur: Partial<Busy> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") cur = {};
    else if (line === "END:VEVENT") {
      if (cur?.start) events.push({ start: cur.start, end: cur.end ?? addDays(cur.start, 1), summary: cur.summary });
      cur = null;
    } else if (cur) {
      const [key, ...rest] = line.split(":");
      const value = rest.join(":");
      const name = key.split(";")[0];
      if (name === "DTSTART") cur.start = icalDate(value);
      else if (name === "DTEND") cur.end = icalDate(value);
      else if (name === "SUMMARY") cur.summary = value;
    }
  }
  return events.filter((e) => isISODate(e.start) && isISODate(e.end) && e.end > e.start);
}

function icalDate(v: string): ISODate {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : "";
}

export function busyNights(events: Busy[]): Set<ISODate> {
  const set = new Set<ISODate>();
  for (const e of events) for (const n of eachNight(e.start, e.end)) set.add(n);
  return set;
}

function stamp(d: ISODate) {
  return d.replaceAll("-", "");
}

/** Our direct bookings as a feed Booking.com can import, so it closes those nights. */
export function buildIcal(name: string, events: { uid: string; start: ISODate; end: ISODate }[]): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const body = events.flatMap((e) => [
    "BEGIN:VEVENT",
    `UID:${e.uid}@serenityapartments.ro`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${stamp(e.start)}`,
    `DTEND;VALUE=DATE:${stamp(e.end)}`,
    "SUMMARY:Serenity direct booking",
    "END:VEVENT",
  ]);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Serenity Apartments//Direct bookings//EN",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${name}`,
    ...body,
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
