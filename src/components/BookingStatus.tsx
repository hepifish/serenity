"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { longDate, money } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Status = "pending" | "paid" | "failed" | "cancelled" | "expired";
type Props = { lang: Locale; ref_: string; token: string; initial: Status; apartment: string; slug: string; checkIn: string; checkOut: string; amount: number };

export default function BookingStatus({ lang, ref_, token, initial, apartment, slug, checkIn, checkOut, amount }: Props) {
  const t = getDict(lang).booking;
  const [status, setStatus] = useState<Status>(initial);

  // Netopia's notification usually lands within seconds of the redirect.
  useEffect(() => {
    if (status !== "pending") return;
    let tries = 0;
    const id = setInterval(async () => {
      tries++;
      const r = await fetch(`/api/booking/${ref_}?t=${encodeURIComponent(token)}`).then((x) => x.json()).catch(() => null);
      if (r?.status && r.status !== "pending") setStatus(r.status);
      if (tries > 90) clearInterval(id);
    }, 2000);
    return () => clearInterval(id);
  }, [status, ref_, token]);

  const copy = t[status];
  const icon =
    status === "paid" ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    : status === "pending" ? <span className="spinner" />
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" /></svg>;

  return (
    <section className="status" aria-live="polite">
      <div className="status-inner">
        <div className="status-mark">{icon}</div>
        <h1 className="display h2">{copy.title}</h1>
        <p className="lead" style={{ textAlign: "center" }}>{copy.text}</p>
        <div className="summary" style={{ width: "min(100%, 26rem)", textAlign: "left", border: "1px solid var(--line)", padding: "1.2rem" }}>
          <div className="summary-row"><span>{t.ref}</span><span className="ref" style={{ fontSize: "1.2rem" }}>{ref_}</span></div>
          <div className="summary-row"><span>{apartment}</span><span>{longDate(checkIn, lang)} → {longDate(checkOut, lang)}</span></div>
          <div className="summary-row total"><span /><strong>{money(amount, lang, true)}</strong></div>
        </div>
        {status === "paid" ? <p className="muted">{t.arrival}</p> : null}
        <div className="actions" style={{ justifyContent: "center" }}>
          {status === "failed" || status === "expired" ? (
            <Link className="btn" href={`/${lang}/apartments/${slug}?in=${checkIn}&out=${checkOut}#availability`}>{t.tryAgain}</Link>
          ) : null}
          <Link className="btn ghost" href={`/${lang}`}>{t.home}</Link>
        </div>
      </div>
    </section>
  );
}
