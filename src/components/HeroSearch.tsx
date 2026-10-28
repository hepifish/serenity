"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DateSheet from "./DateSheet";
import { searchStore, useSearch } from "@/lib/search-store";
import { addDays, isISODate, type ISODate } from "@/lib/dates";
import { range, shortDate } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Props = { lang: Locale; today: ISODate; maxGuests: number };
type Combined = { today: ISODate; maxDate: ISODate; apartments: { slug: string; minNights: number; busy: ISODate[]; prices: Record<ISODate, number> }[] };

export default function HeroSearch({ lang, today, maxGuests }: Props) {
  const t = getDict(lang).search;
  const s = useSearch();
  const [open, setOpen] = useState(false);
  const [cal, setCal] = useState<Combined | null>(null);

  // All calendars together: a night is closed only when no apartment can take it.
  useEffect(() => {
    fetch("/api/availability").then((r) => (r.ok ? r.json() : null)).then(setCal).catch(() => null);
  }, []);
  const merged = useMemo(() => {
    if (!cal?.apartments.length) return null;
    const sets = cal.apartments.map((a) => new Set(a.busy));
    const busy = new Set<ISODate>();
    const prices = new Map<ISODate, number>();
    for (let d = cal.today; d <= cal.maxDate; d = addDays(d, 1)) {
      const open = cal.apartments.filter((a, i) => !sets[i].has(d) && a.prices[d]);
      if (!open.length) busy.add(d);
      else prices.set(d, Math.min(...open.map((a) => a.prices[d])));
    }
    return { busy, prices, sets, minNights: Math.min(...cal.apartments.map((a) => a.minNights)) };
  }, [cal]);
  const limitFor = useCallback(
    (arrival: ISODate) => {
      if (!cal || !merged) return null;
      let best: ISODate | null = null;
      cal.apartments.forEach((a, i) => {
        if (merged.sets[i].has(arrival)) return;
        let d = addDays(arrival, 1);
        while (d <= cal.maxDate && !merged.sets[i].has(d)) d = addDays(d, 1);
        if (!best || d > best) best = d;
      });
      return best ?? arrival;
    },
    [cal, merged],
  );

  // A shared link (?in=&out=&guests=) runs its search straight away.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const a = q.get("in"), b = q.get("out"), g = Number(q.get("guests"));
    if (g >= 1 && g <= maxGuests) searchStore.setGuests(g);
    if (isISODate(a) && isISODate(b) && b > a && a >= today) {
      searchStore.setDates(a, b);
      searchStore.run();
    }
  }, [today, maxGuests]);

  function submit() {
    if (!s.checkIn || !s.checkOut) return setOpen(true);
    searchStore.run();
    document.getElementById("apartments")?.scrollIntoView({ behavior: "smooth" });
  }

  const results = s.results ? Object.values(s.results) : null;
  const free = results?.filter((r) => r.available).length ?? 0;

  return (
    <>
    <div className="search" role="search">
      <button type="button" className="search-field" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="search-label">{t.dates}</span>
        <span className={`search-value ${s.checkIn ? "" : "placeholder"}`}>
          {s.checkIn && s.checkOut ? range(s.checkIn, s.checkOut, lang) : s.checkIn ? `${shortDate(s.checkIn, lang)} → …` : t.pickDates}
        </span>
      </button>
      <div className="search-field guests">
        <span className="search-label" id="guests-label">{t.guests}</span>
        <span className="stepper" role="group" aria-labelledby="guests-label">
          <button type="button" aria-label={t.fewer} disabled={s.guests <= 1} onClick={() => searchStore.setGuests(s.guests - 1)}>−</button>
          <output aria-live="polite" aria-label={t.guest(s.guests)}>{s.guests}</output>
          <button type="button" aria-label={t.more} disabled={s.guests >= maxGuests} onClick={() => searchStore.setGuests(s.guests + 1)}>+</button>
        </span>
      </div>
      <button type="button" className="btn" onClick={submit} disabled={s.loading}>
        {t.submit}
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </button>
      <DateSheet
        open={open}
        onClose={() => setOpen(false)}
        lang={lang}
        title={t.pickDates}
        today={cal?.today ?? addDays(today, 1)}
        maxDate={cal?.maxDate ?? addDays(today, 180)}
        busy={merged?.busy}
        minNights={merged?.minNights ?? 1}
        limitFor={merged ? limitFor : undefined}
        checkIn={s.checkIn}
        checkOut={s.checkOut}
        onChange={(a, b) => {
          searchStore.setDates(a, b);
          if (a && b) {
            setOpen(false);
            searchStore.run();
          }
        }}
      />
    </div>
    <p className="search-status" aria-live="polite">
      {s.loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : results ? (
        <a href="#apartments" className="link">{t.status(free, results.length)} ↓</a>
      ) : null}
    </p>
    </>
  );
}
