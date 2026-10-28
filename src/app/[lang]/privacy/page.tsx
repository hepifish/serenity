import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
          <article className="prose">
            <h1>{doc.title}</h1>
            <p className="muted">{UPDATED[lang]}: {doc.updated}</p>
            {doc.intro ? <p>{doc.intro}</p> : null}
            {doc.sections.map((s) => (
              <section key={s.h} aria-labelledby={slug(s.h)} style={{ display: "grid", gap: "1rem" }}>
                <h2 id={slug(s.h)}>{s.h}</h2>
                {s.p?.map((p, i) => <p key={i}>{linkify(p)}</p>)}
                {s.ul ? <ul>{s.ul.map((li, i) => <li key={i}>{linkify(li)}</li>)}</ul> : null}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}

/** "7. Anulare, modificare și rambursare" → "anulare-modificare-si-rambursare" */
function slug(h: string) {
  return h
    .replace(/^\d+\.\s*/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Turns URLs, www. hosts and email addresses in the copy into links. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s,;]+|www\.[^\s,;]+[a-z]|[\w.+-]+@[\w-]+\.[\w.]+[a-z])/g).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") ? `mailto:${part}` : part.startsWith("http") ? part : `https://${part}`;
    return <a key={i} href={href} {...(part.includes("@") ? {} : { target: "_blank", rel: "noopener" })}>{part}</a>;
  });
}
