"use client";

import Link from "next/link";
import { useState } from "react";
import PayLogos from "./PayLogos";
import { money } from "@/lib/format";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Props = { lang: Locale; slug: string; checkIn: string; checkOut: string; guests: number; total: number };

const COUNTRIES = ["Romania", "Germany", "Austria", "Switzerland", "Hungary", "Moldova", "Italy", "France", "Spain", "United Kingdom", "Netherlands", "Belgium", "Poland", "Czechia", "Bulgaria", "Serbia", "Israel", "United States", "Other"];

export default function CheckoutForm({ lang, slug, checkIn, checkOut, guests, total }: Props) {
  const t = getDict(lang).checkout;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setTouched(true);
    if (!form.checkValidity()) {
      setError(t.errors.invalid);
      (form.querySelector(":invalid") as HTMLElement | null)?.focus();
      return;
    }
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apartment: slug, checkIn, checkOut, guests, lang,
          name: f.name, email: f.email, phone: f.phone, country: f.country, note: f.note || undefined,
          payMethod: f.payMethod, acceptTerms: f.terms === "on", website: f.website,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.paymentUrl) {
        location.href = data.paymentUrl; // Netopia's secure page
        return;
      }
      setError(t.errors[data.error] ?? t.errors.generic);
    } catch {
      setError(t.errors.generic);
    }
    setBusy(false);
  }

  return (
    <form className={`form ${touched ? "touched" : ""}`} onSubmit={submit} noValidate>
      <fieldset className="fieldset">
        <legend><span>01</span>{t.details}</legend>
        <div className="field">
          <label htmlFor="name">{t.name}</label>
          <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="email">{t.email}</label>
            <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" aria-describedby="email-hint" />
            <span id="email-hint" className="hint">{t.emailHint}</span>
          </div>
          <div className="field">
            <label htmlFor="phone">{t.phone}</label>
            <input id="phone" name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" aria-describedby="phone-hint" />
            <span id="phone-hint" className="hint">{t.phoneHint}</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="country">{t.country}</label>
          <select id="country" name="country" required defaultValue={lang === "ro" ? "Romania" : lang === "de" ? "Germany" : ""} autoComplete="country-name">
            <option value="" disabled>…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="note">{t.note}</label>
          <textarea id="note" name="note" maxLength={1000} />
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend><span>02</span>{t.pay}</legend>
        <div className="choice" role="radiogroup">
          <label>
            <input type="radio" name="payMethod" value="card" defaultChecked />
            <span>{t.card}</span>
            <small>{t.cardHint}</small>
          </label>
          <label>
            <input type="radio" name="payMethod" value="voucher" />
            <span>{t.voucher}</span>
            <small>{t.voucherHint}</small>
          </label>
        </div>
        <p className="hint">{t.voucherNote}</p>
      </fieldset>

      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <label className="check">
        <input type="checkbox" name="terms" required />
        <span>
          {t.terms("§", "¶").split(/([§¶])/).map((part, i) =>
            part === "§" ? <Link key={i} className="link" href={`/${lang}/terms`} target="_blank">{t.termsLink}</Link>
            : part === "¶" ? <Link key={i} className="link" href={`/${lang}/privacy`} target="_blank">{t.privacyLink}</Link>
            : part)}
        </span>
      </label>
      <p className="hint">{t.withdrawal}</p>

      {error ? <p className="notice err" role="alert">{error}</p> : null}

      <button className="btn block" disabled={busy} style={{ minHeight: 56 }}>
        {busy ? t.submitting : t.submit(money(total, lang, true))}
      </button>
      <p className="hint" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V7a4 4 0 018 0v4" /></svg>
        {t.secure} {t.hold}
      </p>
      <PayLogos />
    </form>
  );
}
