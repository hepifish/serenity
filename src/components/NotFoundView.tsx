"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AptName from "@/components/AptName";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getDict } from "@/i18n";
import { apartmentCopy } from "@/i18n/apartments";
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config";
import { apartmentList } from "@/lib/apartments";

/**
 * A 404 in the site's own clothes, in the visitor's language, with the four
 * doors that do lead somewhere. A 404 gets no params and the server does not
 * see the path here (app/global-not-found.tsx), so it renders in English and
 * switches to the path's language once it runs in the browser.
 */
export default function NotFoundView() {
  const [lang, setLang] = useState<Locale>(DEFAULT_LOCALE);
  const t = getDict(lang);
  useEffect(() => {
    const first = window.location.pathname.split("/")[1];
    if (isLocale(first)) setLang(first);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <>
      <title>{t.notFound.meta}</title>
      <Header lang={lang} t={t.nav} solid />
      <main id="main" className="nf">
        <div className="wrap nf-wrap">
          <p className="eyebrow">404</p>
          <h1 className="display h2">{t.notFound.title}</h1>
          <p className="lead">{t.notFound.lead}</p>
          <ul className="nf-list">
            {apartmentList().map((a) => (
              <li key={a.slug} style={{ ["--accent" as string]: a.accent }}>
                <Link href={`/${lang}/apartments/${a.slug}`}>
                  <span className="apt-num">{a.number}</span>
                  <span className="nf-name" style={{ fontFamily: `var(--font-${a.slug}), var(--serif)` }}><AptName slug={a.slug} name={a.name} /></span>
                  <span className="muted nf-tag">{apartmentCopy(lang, a.slug).tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={`/${lang}`} className="btn ghost">{t.notFound.home}</Link>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
