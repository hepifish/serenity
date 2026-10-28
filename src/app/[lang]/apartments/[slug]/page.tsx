import type { Metadata } from "next";
import AptName from "@/components/AptName";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import ApartmentBooking from "@/components/ApartmentBooking";
import Reveal from "@/components/Reveal";
import { getDict } from "@/i18n";
import { apartmentCopy } from "@/i18n/apartments";
import { LOCALES, isLocale } from "@/i18n/config";
import { APARTMENTS, APARTMENT_SLUGS, apartmentList, isApartmentSlug } from "@/lib/apartments";
import { addDays, todayInSibiu } from "@/lib/dates";
import { fromPrice } from "@/lib/pricing";
import { COMPANY, SITE_URL } from "@/lib/site";
import { JsonLd, apartmentLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => APARTMENT_SLUGS.map((slug) => ({ lang, slug })));
}

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isApartmentSlug(slug)) return {};
  const a = APARTMENTS[slug];
  const c = apartmentCopy(lang, slug);
  const meta = pageMeta(lang, `/apartments/${slug}`, `${a.name} · ${c.tagline} · Serenity Apartments Sibiu`, `${c.intro} ${c.story[0]}`.slice(0, 158), a.gallery[0]?.src);
  return a.comingSoon ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function ApartmentPage({ params }: Params) {
  const { lang, slug } = await params;
  if (!isLocale(lang) || !isApartmentSlug(slug)) notFound();
  const t = getDict(lang);
  const a = APARTMENTS[slug];
  const c = apartmentCopy(lang, slug);
  const today = todayInSibiu();
  const price = a.comingSoon ? null : await fromPrice(slug, addDays(today, 1), addDays(today, 90)).catch(() => null);
  const photos = a.gallery.map((g, i) => ({ ...g, alt: c.alts[i] ?? `${a.name}, ${i + 1}` }));
  const others = apartmentList().filter((o) => o.slug !== slug);

  const story = (
    <>
      <div className="story">
        {c.story.map((p, i) => <p key={i} className={`rv ${i ? "d1" : ""}`}>{p}</p>)}
      </div>
      {photos.length ? <div className="rv"><Gallery photos={photos} moreLabel={t.apartments.photos(photos.length)} /></div> : null}
      {c.highlights.length ? (
        <section aria-labelledby="highlights-title" style={{ display: "grid", gap: "1.4rem" }}>
          <h2 id="highlights-title" className="display h3 rv">{t.apartment.highlights}</h2>
          <ul className="highlights rv d1">{c.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
      ) : null}
      <section aria-labelledby="rules-title" style={{ display: "grid", gap: "1.4rem" }}>
        <h2 id="rules-title" className="display h3 rv">{t.apartment.houseRules}</h2>
        <ul className="highlights rv d1">{t.apartment.rules.map((h) => <li key={h}>{h}</li>)}</ul>
      </section>
    </>
  );

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header lang={lang} t={t.nav} />
      <JsonLd data={apartmentLd(lang, slug, a.name, c.intro, price)} />
      <JsonLd data={breadcrumbLd([
        { name: "Serenity Apartments", url: `${SITE_URL}/${lang}` },
        { name: a.name, url: `${SITE_URL}/${lang}/apartments/${slug}` },
      ])} />
      <Reveal />
      <main id="main" className={`theme-${slug}`}>
        <section className="apt-hero" style={a.gallery[0] ? undefined : { background: "radial-gradient(120% 90% at 30% 20%, #4a2738 0%, #2a1621 45%, var(--ink) 100%)" }}>
          {a.gallery.length ? (() => {
            const h = a.pageHeroIndex ?? 0;
            return <Image src={a.gallery[h].src} alt={photos[h].alt} fill priority sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 45%", zIndex: -1 }} />;
          })() : null}
          <div className="wrap">
            <nav className="crumbs" aria-label="Breadcrumb"><Link href={`/${lang}#apartments`}>← {t.apartment.back}</Link></nav>
            <p className="eyebrow">{a.number} · {c.tagline}</p>
            <h1 className="display h1"><AptName slug={slug} name={a.name} /></h1>
            <p className="lead" style={{ color: "var(--bone)" }}>{c.intro}</p>
            {!a.comingSoon ? (
              <ul className="facts">
                <li>{t.apartments.upTo(a.maxGuests)}</li>
                <li>{t.apartments.bedrooms(a.bedrooms)}</li>
                {a.sizeM2 ? <li>{a.sizeM2} m²</li> : null}
                <li>Sibiu</li>
              </ul>
            ) : null}
          </div>
        </section>

        {a.comingSoon ? (
          <div className="wrap section" style={{ display: "grid", gap: "2rem", maxWidth: 820 }}>
            <div className="story">{c.story.map((p, i) => <p key={i}>{p}</p>)}</div>
            <div className="actions">
              <Link href={`/${lang}#contact`} className="btn">{t.nav.contact}</Link>
              <a className="btn ghost" href={`mailto:${COMPANY.email}?subject=${encodeURIComponent(a.name)}`}>{COMPANY.email}</a>
            </div>
          </div>
        ) : (
          <ApartmentBooking lang={lang} slug={slug} name={a.name} maxGuests={a.maxGuests} bookingUrl={a.bookingUrl}>
            {story}
          </ApartmentBooking>
        )}

        <section className="section" style={{ borderTop: "1px solid var(--line)" }} aria-labelledby="others-title">
          <div className="wrap">
            <h2 id="others-title" className="display h3" style={{ marginBottom: "2rem" }}>{t.apartments.title}</h2>
            <div className="results-grid">
              {others.map((o) => (
                <Link key={o.slug} href={`/${lang}/apartments/${o.slug}`} className="result" style={{ ["--accent" as string]: o.accent }}>
                  {o.gallery[0] ? (
                    <Image src={o.gallery[0].src} alt={o.name} width={o.gallery[0].w} height={o.gallery[0].h} sizes="(max-width: 860px) 100vw, 33vw" style={{ aspectRatio: "4 / 3", objectFit: "cover", width: "100%", height: "auto" }} />
                  ) : <div style={{ aspectRatio: "4 / 3", background: "radial-gradient(120% 90% at 30% 20%, #4a2738, var(--ink-2))" }} />}
                  <div className="result-body">
                    <p className="apt-num">{o.number}</p>
                    <p className="rcard-name" style={{ fontFamily: `var(--font-${o.slug}), var(--serif)` }}><AptName slug={o.slug} name={o.name} /></p>
                    <p className="muted" style={{ fontSize: "0.9rem" }}>{apartmentCopy(lang, o.slug).tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
