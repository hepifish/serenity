"use client";

import { useMemo, useState } from "react";
import { addDays, fromDate, toDate, type ISODate } from "@/lib/dates";

type Props = {
  locale: string;
  today: ISODate;
  maxDate: ISODate;
  checkIn: ISODate | null;
  checkOut: ISODate | null;
  onChange: (checkIn: ISODate | null, checkOut: ISODate | null) => void;
  /** Nights that cannot be slept in. A busy night can still be a check-out day. */
  busy?: Set<ISODate>;
  /** Nightly price, shown small under each day. */
  prices?: Map<ISODate, number>;
  minNights?: number;
  labels: { prev: string; next: string; checkIn: string; checkOut: string; minNights: (n: number) => string };
  months?: number;
};

function monthStart(d: ISODate) {
  return d.slice(0, 8) + "01";
}

function addMonths(first: ISODate, n: number): ISODate {
  const d = toDate(first);
  d.setUTCMonth(d.getUTCMonth() + n);
  return fromDate(d);
}

/**
 * Two months side by side on desktop, one under the other on a phone.
 * First tap picks arrival, second tap picks departure. A tap that would jump
 * over a booked night starts a new stay instead, so an impossible range can
 * never be selected in the first place.
 */
export default function RangeCalendar({
  locale, today, maxDate, checkIn, checkOut, onChange, busy, prices, minNights = 1, labels, months = 2,
}: Props) {
  const [first, setFirst] = useState<ISODate>(monthStart(checkIn ?? today));
  const [hover, setHover] = useState<ISODate | null>(null);

  const weekdayNames = useMemo(() => {
    const f = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
    // 2024-01-01 was a Monday
    return Array.from({ length: 7 }, (_, i) => f.format(toDate(addDays("2024-01-01", i))));
  }, [locale]);
  const monthName = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" }), [locale]);
  const dayName = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }), [locale]);

  const selectingOut = !!checkIn && !checkOut;

  /** First booked night after the chosen arrival: departure can be that day, never later. */
  const limit = useMemo(() => {
    if (!selectingOut || !busy) return null;
    for (let d = checkIn!; d <= maxDate; d = addDays(d, 1)) if (busy.has(d)) return d;
    return null;
  }, [selectingOut, busy, checkIn, maxDate]);

  function state(d: ISODate) {
    const past = d < today || d > maxDate;
    const nightBusy = !!busy?.has(d);
    let disabled = past;
    if (selectingOut) {
      const tooShort = d > checkIn! && d < addDays(checkIn!, minNights);
      const beyond = limit !== null && d > limit;
      // Before the arrival, a tap restarts the stay, so only busy nights block it.
      disabled = past || (d <= checkIn! ? nightBusy && d !== checkIn : tooShort || beyond);
    } else {
      disabled = past || nightBusy;
    }
    const end = checkOut ?? (selectingOut && hover && hover > checkIn! ? hover : null);
    const inRange = !!checkIn && !!end && d > checkIn && d < end;
    return { disabled, nightBusy, inRange, isIn: d === checkIn, isOut: d === checkOut || (!checkOut && d === end) };
  }

  function pick(d: ISODate) {
    if (!checkIn || checkOut || d <= checkIn) return onChange(d, null);
    onChange(checkIn, d);
  }

  const canPrev = first > monthStart(today);
  const canNext = addMonths(first, months) <= monthStart(maxDate);

  return (
    <div className="cal">
      <div className="cal-nav">
        <button type="button" className="cal-arrow" onClick={() => setFirst(addMonths(first, -1))} disabled={!canPrev} aria-label={labels.prev}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button type="button" className="cal-arrow" onClick={() => setFirst(addMonths(first, 1))} disabled={!canNext} aria-label={labels.next}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
      <div className="cal-months">
        {Array.from({ length: months }, (_, m) => {
          const start = addMonths(first, m);
          const offset = (toDate(start).getUTCDay() + 6) % 7; // Monday first
          const days: ISODate[] = [];
          for (let d = start; d.slice(0, 7) === start.slice(0, 7); d = addDays(d, 1)) days.push(d);
          return (
            <div className="cal-month" key={start}>
              <p className="cal-title">{monthName.format(toDate(start))}</p>
              <div className="cal-grid" role="grid">
                {weekdayNames.map((w, i) => <span key={i} className="cal-wd" aria-hidden="true">{w}</span>)}
                {Array.from({ length: offset }, (_, i) => <span key={"e" + i} />)}
                {days.map((d) => {
                  const s = state(d);
                  const price = prices?.get(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={s.disabled}
                      onClick={() => pick(d)}
                      onMouseEnter={() => setHover(d)}
                      onMouseLeave={() => setHover(null)}
                      className={[
                        "cal-day",
                        s.inRange && "in-range",
                        s.isIn && "is-in",
                        s.isOut && "is-out",
                        s.nightBusy && "busy",
                      ].filter(Boolean).join(" ")}
                      aria-pressed={s.isIn || s.isOut}
                      aria-label={dayName.format(toDate(d))}
                    >
                      <span className="cal-num">{Number(d.slice(8))}</span>
                      {price && !s.nightBusy && d >= today ? <span className="cal-price">{price}</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="cal-hint" aria-live="polite">
        {!checkIn ? labels.checkIn : !checkOut ? (minNights > 1 ? `${labels.checkOut} · ${labels.minNights(minNights)}` : labels.checkOut) : " "}
      </p>
    </div>
  );
}
