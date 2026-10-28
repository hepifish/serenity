"use client";

import { useEffect, useState } from "react";
import DateSheet from "./DateSheet";
import { searchStore, useSearch } from "@/lib/search-store";
import { addDays, isISODate, type ISODate } from "@/lib/dates";
import { range, shortDate } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Props = { lang: Locale; today: ISODate; maxGuests: number };

export default function HeroSearch({ lang, today, maxGuests }: Props) {
  const t = getDict(lang).search;
  const s = useSearch();
  const [open, setOpen] = useState(false);

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
        today={addDays(today, 1)}
        maxDate={addDays(today, 180)}
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
