"use client";

import Link from "next/link";
import { useState } from "react";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

type Props = {
  lang: Locale;
  apartments: { slug: string; name: string }[];
  prefill: { reservation?: string; apartment?: string; arrival?: string; source?: string };
};

const COUNTRIES = ["Romania", "Germany", "Austria", "Switzerland", "Hungary", "Moldova", "Italy", "France", "Spain", "United Kingdom", "Netherlands", "Belgium", "Poland", "Czechia", "Bulgaria", "Serbia", "Israel", "United States", "Other"];

export default function CheckinForm({ lang, apartments, prefill }: Props) {
  const t = getDict(lang).checkin;
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [country, setCountry] = useState(lang === "ro" ? "Romania" : lang === "de" ? "Germany" : "");
  const [company, setCompany] = useState(false);

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
    const num = (v?: string) => (v ? Number(v) : undefined);
    setState("sending");
    setError(null);
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: f.source, reservation: f.reservation || undefined, apartment: f.apartment || undefined, arrival: f.arrival,
        nights: num(f.nights), guests: num(f.guests), fullName: f.fullName, email: f.email, phone: f.phone || undefined,
        street: f.street, city: f.city, postalCode: f.postalCode || undefined, country: f.country,
        cnp: f.cnp?.replace(/\s/g, "") || undefined, companyName: f.companyName || undefined, companyCui: f.companyCui || undefined,
        acceptRules: f.rules === "on", lang, website: f.website,
      }),
    }).catch(() => null);
    if (res?.ok) return setState("done");
    const data = await res?.json().catch(() => ({}));
    setError(t.errors[data?.error] ?? t.errors.generic);
    setState("idle");
  }

  if (state === "done") {
    return (
      <div className="status-inner" style={{ justifyItems: "start", textAlign: "left" }} role="status">
        <div className="status-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
        <h2 className="display h2">{t.doneTitle}</h2>
        <p className="lead">{t.doneText}</p>
      </div>
    );
  }

  return (
    <form className={`form ${touched ? "touched" : ""}`} onSubmit={submit} noValidate>
      <fieldset className="fieldset">
        <legend><span>01</span>{t.stay}</legend>
        <div className="field">
          <span className="search-label">{t.source}</span>
          <div className="choice choice-3" role="radiogroup">
            {(["direct", "booking", "other"] as const).map((s) => (
              <label key={s}>
                <input type="radio" name="source" value={s} defaultChecked={(prefill.source ?? "booking") === s} required />
                <span>{t.sources[s]}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="reservation">{t.reservation}</label>
            <input id="reservation" name="reservation" defaultValue={prefill.reservation} maxLength={40} aria-describedby="res-hint" />
            <span id="res-hint" className="hint">{t.reservationHint}</span>
          </div>
          <div className="field">
            <label htmlFor="apartment">{t.apartment}</label>
            <select id="apartment" name="apartment" defaultValue={prefill.apartment ?? ""} required>
              <option value="" disabled>…</option>
              {apartments.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row row-211">
          <div className="field">
            <label htmlFor="arrival">{t.arrival}</label>
            <input id="arrival" name="arrival" type="date" required defaultValue={prefill.arrival} />
          </div>
          <div className="field">
            <label htmlFor="nights">{t.nights}</label>
            <input id="nights" name="nights" type="number" min={1} max={90} inputMode="numeric" />
          </div>
          <div className="field">
            <label htmlFor="guests">{t.guests}</label>
            <input id="guests" name="guests" type="number" min={1} max={16} inputMode="numeric" />
          </div>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend><span>02</span>{t.you}</legend>
        <div className="field">
          <label htmlFor="fullName">{t.fullName}</label>
          <input id="fullName" name="fullName" required minLength={3} maxLength={120} autoComplete="name" />
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="ci-email">{t.email}</label>
            <input id="ci-email" name="email" type="email" required maxLength={200} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="ci-phone">{t.phone}</label>
            <input id="ci-phone" name="phone" type="tel" maxLength={40} autoComplete="tel" />
          </div>
        </div>
        <p className="search-label" style={{ marginTop: "0.6rem" }}>{t.address}</p>
        <div className="field">
          <label htmlFor="street">{t.street}</label>
          <input id="street" name="street" required minLength={3} maxLength={200} autoComplete="street-address" />
        </div>
        <div className="form-row row-21">
          <div className="field">
            <label htmlFor="city">{t.city}</label>
            <input id="city" name="city" required minLength={2} maxLength={100} autoComplete="address-level2" />
          </div>
          <div className="field">
            <label htmlFor="postalCode">{t.postalCode}</label>
            <input id="postalCode" name="postalCode" maxLength={20} autoComplete="postal-code" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="ci-country">{t.country}</label>
          <select id="ci-country" name="country" required value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name">
            <option value="" disabled>…</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {country === "Romania" ? (
          <div className="field">
            <label htmlFor="cnp">{t.cnp}</label>
            <input id="cnp" name="cnp" inputMode="numeric" pattern="\s*\d{13}\s*" maxLength={16} autoComplete="off" aria-describedby="cnp-hint" />
            <span id="cnp-hint" className="hint">{t.cnpHint}</span>
          </div>
        ) : null}
        <label className="check">
          <input type="checkbox" checked={company} onChange={(e) => setCompany(e.target.checked)} />
          <span>{t.company}</span>
        </label>
        {company ? (
          <div className="form-row">
            <div className="field">
              <label htmlFor="companyName">{t.companyName}</label>
              <input id="companyName" name="companyName" maxLength={160} autoComplete="organization" />
            </div>
            <div className="field">
              <label htmlFor="companyCui">{t.companyCui}</label>
              <input id="companyCui" name="companyCui" maxLength={20} />
            </div>
          </div>
        ) : null}
      </fieldset>

      <fieldset className="fieldset">
        <legend><span>03</span>{t.rulesTitle}</legend>
        <ol className="rules">
          {t.rules.map((r) => <li key={r}>{r}</li>)}
        </ol>
        <label className="check">
          <input type="checkbox" name="rules" required />
          <span>{t.accept}</span>
        </label>
        <p className="hint">
          {t.privacy} <Link className="link" href={`/${lang}/privacy`} target="_blank">{getDict(lang).footer.privacy.toLowerCase()}</Link>.
        </p>
      </fieldset>

      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {error ? <p className="notice err" role="alert">{error}</p> : null}
      <button className="btn block" disabled={state === "sending"} style={{ minHeight: 56 }}>
        {state === "sending" ? t.sending : t.submit}
      </button>
    </form>
  );
}
