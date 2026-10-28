"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import RangeCalendar from "./RangeCalendar";
import DateSheet from "./DateSheet";
import PayLogos from "./PayLogos";
import { eachNight, isISODate, type ISODate } from "@/lib/dates";
import { mediumDate, money, shortDate } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Availability = {
  today: ISODate;
  maxDate: ISODate;
  minNights: number;
  cleaningFee: number;
  cityTaxPercent: number;
  busy: ISODate[];
  prices: Record<ISODate, number>;
};

type Props = {
  lang: Locale;
  slug: string;
  name: string;
  maxGuests: number;
  bookingUrl: string;
  children: React.ReactNode;
};

/**
 * The apartment page below the photos: the story on the left (server
 * rendered, passed in as children) and the booking panel on the right. One
 * set of dates drives the inline calendar, the panel and the phone's bottom bar.
 */
export default function ApartmentBooking({ lang, slug, name, maxGuests, bookingUrl, children }: Props) {
  const t = getDict(lang);
  const a = t.apartment;
  const [data, setData] = useState<Availability | null>(null);
  const [error, setError] = useState(false);
  const [checkIn, setIn] = useState<ISODate | null>(null);
  const [checkOut, setOut] = useState<ISODate | null>(null);
  const [guests, setGuests] = useState(2);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const i = q.get("in"), o = q.get("out"), g = Number(q.get("guests"));
    if (isISODate(i) && isISODate(o) && o > i) (setIn(i), setOut(o));
    if (g >= 1 && g <= maxGuests) setGuests(g);
    fetch(`/api/availability/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, [slug, maxGuests]);

  // Dates that came in through a link may have been booked since: let them go.
  useEffect(() => {
    if (!data || !checkIn) return;
    const ok = checkIn >= data.today && (!checkOut || eachNight(checkIn, checkOut).every((n) => !data.busy.includes(n) && n in data.prices));
    if (!ok) (setIn(null), setOut(null));
  }, [data, checkIn, checkOut]);

  const busy = useMemo(() => new Set(data?.busy ?? []), [data]);
  const prices = useMemo(() => new Map(Object.entries(data?.prices ?? {})), [data]);

  // Dates that came in through a link may no longer be free: drop them quietly.
  const valid = !!(data && checkIn && checkOut && checkIn >= data.today && eachNight(checkIn, checkOut).every((n) => !busy.has(n) && prices.has(n)));
  const nights = valid ? eachNight(checkIn!, checkOut!) : [];
  const lodging = nights.reduce((s, n) => s + (prices.get(n) ?? 0), 0);
  const cleaning = data?.cleaningFee ?? 0;
  const tax = Math.round(((lodging + cleaning) * (data?.cityTaxPercent ?? 0)) ) / 100;
  const total = lodging + cleaning + tax;
  const minPrice = prices.size ? Math.min(...prices.values()) : null;
  const tooShort = valid && data && nights.length < data.minNights;
  const canBook = valid && !tooShort;
  const href = canBook ? `/${lang}/book/${slug}?in=${checkIn}&out=${checkOut}&guests=${guests}` : "#";

  const onDates = (i: ISODate | null, o: ISODate | null) => {
    setIn(i);
    setOut(o);
    const url = new URL(location.href);
    if (i && o) (url.searchParams.set("in", i), url.searchParams.set("out", o));
    else (url.searchParams.delete("in"), url.searchParams.delete("out"));
    history.replaceState(null, "", url);
  };

  const labels = { prev: t.search.prev, next: t.search.next, checkIn: t.search.pickArrival, checkOut: t.search.pickDeparture, minNights: t.search.minNights };

  const summary = canBook ? (
    <div className="summary" aria-live="polite">
      <div className="summary-row"><span>{a.lodging} · {a.nightsLabel(nights.length)}</span><span>{money(lodging, lang)}</span></div>
      {cleaning ? <div className="summary-row"><span>{a.cleaning}</span><span>{money(cleaning, lang)}</span></div> : null}
      <div className="summary-row"><span>{a.cityTax}</span><span>{money(tax, lang, true)}</span></div>
      <p className="tax-note">{a.cityTaxNote}</p>
      <div className="summary-row total"><span>{a.total}</span><strong>{money(total, lang, true)}</strong></div>
    </div>
  ) : null;

  return (
    <>
      <div className="wrap section" style={{ paddingTop: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="apt-layout">
          <div className="apt-main">
            {children}
            <section id="availability" aria-labelledby="availability-title" style={{ display: "grid", gap: "1.4rem" }}>
              <h2 id="availability-title" className="display h3">{a.availability}</h2>
              <p className="muted">{a.availabilityLead}</p>
              {error ? <p className="notice err">{a.calendarError}</p> : !data ? <p className="muted">{a.loading}</p> : (
                <RangeCalendar
                  locale={lang}
                  today={data.today}
                  maxDate={data.maxDate}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onChange={onDates}
                  busy={busy}
                  prices={prices}
                  minNights={data.minNights}
                  labels={labels}
                />
              )}
            </section>
          </div>

          <aside className="panel" aria-label={a.availability}>
            <p className="panel-price">
              {minPrice ? <>{t.apartments.from} <strong>{money(minPrice, lang)}</strong> / {t.apartments.perNight}</> : <strong style={{ fontSize: "1.6rem" }}>{name}</strong>}
            </p>
            <div className="panel-dates">
              <button type="button" onClick={() => setSheet(true)} disabled={!data}>
                <span className="search-label">{t.search.checkIn}</span>
                <span>{checkIn ? mediumDate(checkIn, lang) : "…"}</span>
              </button>
              <button type="button" onClick={() => setSheet(true)} disabled={!data}>
                <span className="search-label">{t.search.checkOut}</span>
                <span>{checkOut ? mediumDate(checkOut, lang) : "…"}</span>
              </button>
            </div>
            <div className="panel-guests">
              <span className="search-label" id="panel-guests">{a.guests}</span>
              <span className="stepper" role="group" aria-labelledby="panel-guests">
                <button type="button" aria-label={t.search.fewer} disabled={guests <= 1} onClick={() => setGuests(guests - 1)}>−</button>
                <output>{guests}</output>
                <button type="button" aria-label={t.search.more} disabled={guests >= maxGuests} onClick={() => setGuests(guests + 1)}>+</button>
              </span>
            </div>
            {summary ?? <p className="muted" style={{ fontSize: "0.92rem" }}>{tooShort && data ? t.search.minNights(data.minNights) : a.pickDates}</p>}
            {canBook ? (
              <Link href={href} className="btn block">{a.reserve}</Link>
            ) : (
              <button type="button" className="btn block" onClick={() => (data ? setSheet(true) : null)} disabled={!data}>{t.search.pickDates}</button>
            )}
            <PayLogos />
            <p className="tax-note">
              {a.alsoOn} <a className="link" href={bookingUrl} target="_blank" rel="noopener">{a.alsoOnLink}</a>
            </p>
          </aside>
        </div>
      </div>

      <div className="mobile-bar">
        <div style={{ display: "grid", lineHeight: 1.3 }}>
          {canBook ? (
            <>
              <strong style={{ fontFamily: "var(--serif)", fontWeight: 400, fontSize: "1.3rem" }}>{money(total, lang)}</strong>
              <span className="muted" style={{ fontSize: "0.8rem" }}>{shortDate(checkIn!, lang)} → {shortDate(checkOut!, lang)}</span>
            </>
          ) : minPrice ? (
            <span className="muted" style={{ fontSize: "0.85rem" }}>{t.apartments.from} <strong style={{ color: "var(--bone)", fontFamily: "var(--serif)", fontSize: "1.3rem", fontWeight: 400 }}>{money(minPrice, lang)}</strong></span>
          ) : null}
        </div>
        {canBook ? <Link href={href} className="btn">{a.reserve}</Link> : <button type="button" className="btn" onClick={() => setSheet(true)} disabled={!data}>{t.search.pickDates}</button>}
      </div>

      {data ? (
        <DateSheet
          open={sheet}
          onClose={() => setSheet(false)}
          lang={lang}
          title={name}
          today={data.today}
          maxDate={data.maxDate}
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={onDates}
          busy={busy}
          prices={prices}
          minNights={data.minNights}
          footer={
            canBook ? (
              <Link href={href} className="btn">{a.reserve} · {money(total, lang)}</Link>
            ) : undefined
          }
        />
      ) : null}
    </>
  );
}
