import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalArticle from "@/components/LegalArticle";
import { getDict } from "@/i18n";
import { isLocale, type Locale } from "@/i18n/config";
import { LEGAL } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ lang: string }> };

const DESCRIPTION: Record<Locale, string> = {
  ro: "Cum prelucrează Serenity Apartments Sibiu datele personale ale oaspeților și vizitatorilor site-ului, și ce drepturi aveți conform GDPR.",
  en: "How Serenity Apartments Sibiu processes the personal data of guests and website visitors, and your rights under the GDPR.",
  de: "Wie Serenity Apartments Sibiu personenbezogene Daten von Gästen und Website-Besuchern verarbeitet und welche Rechte Sie nach der DSGVO haben.",
};
const UPDATED: Record<Locale, string> = { ro: "Ultima actualizare", en: "Last updated", de: "Zuletzt aktualisiert" };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/privacy", `${LEGAL[lang].privacy.title} · Serenity Apartments Sibiu`, DESCRIPTION[lang]);
}

export default async function PrivacyPage({ params }: Params) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const doc = LEGAL[lang].privacy;

  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className="checkout">
        <div className="wrap">
          <LegalArticle doc={doc} meta={`${UPDATED[lang]}: ${doc.updated}`} />
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
