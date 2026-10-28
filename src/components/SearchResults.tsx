"use client";

import AptName from "./AptName";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { searchStore, useSearch, type Result } from "@/lib/search-store";
import { money, range } from "@/lib/format";
import { getDict } from "@/i18n";
import "./search.css";
import type { Locale } from "@/i18n/config";

export type AptCard = {
  slug: string;
  name: string;
  number: string;
  accent: string;
  tagline: string;
  image: { src: string; w: number; h: number } | null;
  /** the front door it shares (lat,lng): apartments with the same one are in one house */
  house: string;
};

/**
 * The answer to the hero search, right under it: every apartment for the
 * chosen dates, free ones first. One can be booked straight away, or several
 * picked and booked together in one payment.
 */
type Props = {
  lang: Locale;
  apartments: AptCard[];
  /** which apartments share a house and which is apart, in one friendly sentence */
  houses: string;
};

export default function SearchResults({ lang, apartments, houses }: Props) {
  const t = getDict(lang);
  const r = t.results;
  const s = useSearch();
  const ref = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const shown = !!(s.results && s.checkIn && s.checkOut);

  // Bring the answer into view the moment it arrives, and take screen readers to it.
  useEffect(() => {
    if (!shown || s.loading) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
    heading.current?.focus({ preventScroll: true });
  }, [shown, s.loading, s.results]);

  // while the first answer is on its way, the hero shows the wait (HeroSearch)
  if (!shown) return null;

  const list = apartments
    .map((a) => ({ a, res: s.results![a.slug] as Result | undefined }))
    .filter((x) => x.res)
    .sort((x, y) => Number(y.res!.available) - Number(x.res!.available));
  const free = list.filter((x) => x.res!.available);
  const biggest = Math.max(...list.map((x) => x.res!.capacity));
  const needsSeveral = s.guests > biggest;
  // a group, or several apartments picked: say which ones are under one roof
  const asGroup = needsSeveral || s.picked.length > 1;
  const doorCount = new Map<string, number>();
  apartments.forEach((a) => doorCount.set(a.house, (doorCount.get(a.house) ?? 0) + 1));

  const picked = free.filter((x) => s.picked.includes(x.a.slug));
  const pickedCap = picked.reduce((n, x) => n + x.res!.capacity, 0);
  const pickedTotal = picked.reduce((n, x) => n + (x.res!.available ? x.res!.total : 0), 0);
  const enough = picked.length > 0 && pickedCap >= s.guests && s.guests >= picked.length;
  const q = `in=${s.checkIn}&out=${s.checkOut}&guests=${s.guests}`;
  const nights = free[0]?.res?.available ? free[0].res.nights : null;

  return (
    <section className="results-panel" id="results" ref={ref} aria-labelledby="results-title" aria-live="polite">
      <div className="wrap">
        <div className="results-head">
          <div>
            <p className="eyebrow">{r.title}</p>
            <h2 id="results-title" className="display h3" ref={heading} tabIndex={-1}>
              {range(s.checkIn!, s.checkOut!, lang)}
              {nights ? <span className="muted"> · {r.nights(nights)}</span> : null}
              <span className="muted"> · {t.search.guest(s.guests)}</span>
            </h2>
          </div>
          <div className="actions">
            <button type="button" className="btn ghost" onClick={() => window.dispatchEvent(new CustomEvent("serenity:pick-dates", { cancelable: true }))}>{r.change}</button>
            <button type="button" className="link" style={{ background: "none", border: 0, cursor: "pointer" }} onClick={() => searchStore.clear()}>{t.search.clear}</button>
          </div>
        </div>

        {free.length === 0 ? <p className="notice">{r.noneFree}</p> : needsSeveral ? <p className="notice">{r.needSeveral(s.guests)}</p> : null}
        {asGroup ? (
          <p className="together-note">
            <strong>{r.together}</strong> {houses}
          </p>
        ) : null}

        <ul className="results-cards">
          {list.map(({ a, res }) => {
            const isPicked = s.picked.includes(a.slug);
            return (
              <li key={a.slug} className={`rcard ${res!.available ? "" : "off"} ${isPicked ? "picked" : ""}`} style={{ ["--card" as string]: a.accent }}>
                <Link href={`/${lang}/apartments/${a.slug}?${q}`} className="rcard-img" tabIndex={-1} aria-hidden="true">
                  {a.image ? <Image src={a.image.src} alt="" width={a.image.w} height={a.image.h} sizes="(max-width: 700px) 100vw, 25vw" /> : <span className="rcard-blank" />}
                </Link>
                <div className="rcard-body">
                  <p className="apt-num" style={{ color: a.accent }}>
                    {a.number}
                    {asGroup && (doorCount.get(a.house) ?? 0) > 1 ? <span className="same-house">{t.common.sameHouse}</span> : null}
                  </p>
                  <h3 className="rcard-name" style={{ fontFamily: `var(--font-${a.slug}), var(--serif)` }}>
                    <Link href={`/${lang}/apartments/${a.slug}?${q}`}><AptName slug={a.slug} name={a.name} /></Link>
                  </h3>
                  <p className="muted rcard-tag">{a.tagline} · {t.apartments.upTo(res!.capacity)}</p>
                  {res!.available ? (
                    <>
                      <p className="rcard-price"><strong>{money(res!.total, lang)}</strong> <span className="muted">{r.total}</span></p>
                      <div className="rcard-actions">
                        {s.guests <= res!.capacity && !s.picked.length ? (
                          <Link href={`/${lang}/book?apts=${a.slug}&${q}`} className="btn">{r.choose}</Link>
                        ) : null}
                        <button type="button" className={`btn ${isPicked ? "" : "ghost"}`} aria-pressed={isPicked} onClick={() => searchStore.toggle(a.slug)}>
                          {isPicked ? `✓ ${r.added}` : r.add}
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="rcard-why">
                      {r.reasons[res!.reason] ?? r.taken}
                      {res!.reason === "min_nights" && res!.minNights ? ` (${t.search.minNights(res!.minNights)})` : ""}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {picked.length ? (
        <div className="pick-bar" role="region" aria-label={r.selection}>
          <div>
            <strong>{picked.map((x) => x.a.name).join(" + ")}</strong>
            <span className="muted">
              {" · "}{r.sleeps(pickedCap)}{" · "}{money(pickedTotal, lang)}
            </span>
            {!enough ? <p className="error-text" style={{ fontSize: "0.82rem" }}>{r.notEnough(s.guests, pickedCap)}</p> : null}
          </div>
          {enough ? (
            <Link href={`/${lang}/book?apts=${picked.map((x) => x.a.slug).join(",")}&${q}`} className="btn">{r.bookPicked(picked.length)}</Link>
          ) : (
            <button type="button" className="btn" disabled>{r.bookPicked(picked.length)}</button>
          )}
        </div>
      ) : null}
    </section>
  );
}
