import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import LegalArticle from "./LegalArticle";
import { TERMS_VERSION, TERMS_VERSIONS } from "@/content/terms";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

const L: Record<Locale, { version: string; updated: string; old: string; current: string }> = {
  ro: { version: "Versiunea", updated: "ultima actualizare", old: "Aceasta este o versiune anterioară, păstrată pentru rezervările făcute cu ea.", current: "Vezi versiunea în vigoare" },
  en: { version: "Version", updated: "last updated", old: "This is an earlier version, kept for the bookings made under it.", current: "See the current version" },
  de: { version: "Version", updated: "zuletzt aktualisiert", old: "Dies ist eine frühere Fassung, aufbewahrt für die damit getätigten Buchungen.", current: "Zur aktuellen Fassung" },
};

/** One version of the terms: the current one at /terms, any accepted one at /terms/[version]. */
export default function TermsView({ lang, version }: { lang: Locale; version: string }) {
  const t = getDict(lang);
  const doc = TERMS_VERSIONS[version][lang];
  const l = L[lang];
  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className="checkout">
        <div className="wrap">
          <LegalArticle
            doc={doc}
            meta={`${l.version} ${version} · ${l.updated}: ${doc.updated}`}
            notice={version === TERMS_VERSION ? null : (
              <p className="notice">{l.old} <Link className="link" href={`/${lang}/terms`}>{l.current}</Link></p>
            )}
          />
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
