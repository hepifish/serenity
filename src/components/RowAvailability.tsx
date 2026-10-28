"use client";

import Link from "next/link";
import { useSearch } from "@/lib/search-store";
import { money, range } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

/**
 * The call to action under each apartment on the home page. Without dates it
 * invites the guest in; once dates are chosen it answers for this apartment:
 * free and at what total, or taken and why.
 */
export default function RowAvailability({ lang, slug, fromPrice, comingSoon }: { lang: Locale; slug: string; fromPrice: number | null; comingSoon?: boolean }) {
  const t = getDict(lang);
  const s = useSearch();
  const r = s.results?.[slug];
  const page = `/${lang}/apartments/${slug}`;

  if (comingSoon) {
    return (
      <div className="actions">
        <Link href={page} className="btn ghost">{t.apartments.discover}</Link>
      </div>
    );
  }

  if (s.loading) {
    return <p className="price-from"><span className="spinner" style={{ width: 16, height: 16, display: "inline-block" }} /></p>;
  }

  if (r && s.checkIn && s.checkOut) {
    const q = `in=${s.checkIn}&out=${s.checkOut}&guests=${s.guests}`;
    if (r.available) {
      return (
        <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
          <p className="price-from">
            {range(s.checkIn, s.checkOut, lang)} · {t.results.nights(r.nights)}
            <br />
            <strong>{money(r.total, lang)}</strong> {t.results.total}
          </p>
          <div className="actions">
            <Link href={`/${lang}/book/${slug}?${q}`} className="btn">{t.results.choose}</Link>
            <Link href={`${page}?${q}`} className="btn ghost">{t.apartments.discover}</Link>
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
        <p className="price-from" style={{ color: "var(--bone-2)" }}>
          {t.results.reasons[r.reason] ?? t.results.taken}
          {r.reason === "min_nights" && r.minNights ? ` (${t.search.minNights(r.minNights)})` : ""}
        </p>
        <div className="actions">
          <Link href={`${page}#availability`} className="btn ghost">{t.apartments.checkAvailability}</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
      {fromPrice ? (
        <p className="price-from">
          {t.apartments.from} <strong>{money(fromPrice, lang)}</strong> / {t.apartments.perNight}
        </p>
      ) : null}
      <div className="actions">
        <Link href={page} className="btn">{t.apartments.discover}</Link>
        <Link href={`${page}#availability`} className="btn ghost">{t.apartments.checkAvailability}</Link>
      </div>
    </div>
  );
}
