import type { Metadata } from "next";
import AptName from "@/components/AptName";
import AptMark from "@/components/AptMark";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroTriptych from "@/components/HeroTriptych";
import SibiuPhotos from "@/components/SibiuPhotos";
import HeroSearch from "@/components/HeroSearch";
import SearchResults from "@/components/SearchResults";
import { money } from "@/lib/format";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getDict } from "@/i18n";
import { apartmentCopy } from "@/i18n/apartments";
import { isLocale } from "@/i18n/config";
import { apartmentList } from "@/lib/apartments";
import { addDays, todayInSibiu } from "@/lib/dates";
import { fromPrice } from "@/lib/pricing";
import { COMPANY } from "@/lib/site";
import { JsonLd, faqLd, lodgingBusinessLd, pageMeta } from "@/lib/seo";

// Prices change in the admin; a minute of staleness is fine for "from … / night".
export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDict(lang);
  return pageMeta(lang, "", t.meta.title, t.meta.description);
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const today = todayInSibiu();
  const apartments = apartmentList();
  const prices = await Promise.all(
    apartments.map((a) => (a.comingSoon ? null : fromPrice(a.slug, addDays(today, 1), addDays(today, 90)).catch(() => null))),
  );
  // a party can spread over several apartments, so the search allows all of them together
  const maxGuests = apartments.filter((a) => !a.comingSoon).reduce((n, a) => n + a.maxGuests, 0);

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Header lang={lang} t={t.nav} />
      <JsonLd data={lodgingBusinessLd(lang, t.meta.description)} />
      <JsonLd data={faqLd(t.faq.items)} />
      <Reveal />

      <main id="main">
        <section className="hero" id="book">
          <div className="hero-copy">
            <p className="eyebrow rv">{t.hero.eyebrow}</p>
            <h1 className="display h1 rv d1">
              <span>{t.hero.title.split(/(\S+-\S+)/).map((w, i) => (i % 2 ? <span key={i} className="nobr">{w}</span> : w))}</span> <em>{t.hero.titleEm}</em>
            </h1>
            <p className="lead rv d2">{t.hero.lead}</p>
            <div className="rv d3" style={{ width: "100%" }}>
              <HeroSearch lang={lang} today={today} maxGuests={maxGuests} />
            </div>
          </div>
          <HeroTriptych lang={lang} />
        </section>

        <SearchResults
          lang={lang}
          apartments={apartments.map((a) => ({
            slug: a.slug,
            name: a.name,
            number: a.number,
            accent: a.accent,
            tagline: apartmentCopy(lang, a.slug).tagline,
            image: a.gallery[0] ?? null,
          }))}
        />

        <section className="section direct" aria-labelledby="direct-title">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow rv">{t.direct.eyebrow}</p>
              <h2 id="direct-title" className="display h2 rv d1">{t.direct.title}</h2>
            </div>
            <ul className="points">
              {t.direct.points.map((p, i) => (
                <li key={p.title} className={`rv d${i + 1}`}>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="apartments" aria-labelledby="apartments-title">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow rv">{t.apartments.eyebrow}</p>
              <h2 id="apartments-title" className="display h2 rv d1">{t.apartments.title}</h2>
            </div>
            <div className="apt-list">
              {apartments.map((a, i) => {
                const c = apartmentCopy(lang, a.slug);
                const [main, ...rest] = a.gallery;
                return (
                  <article key={a.slug} className="apt-row" style={{ ["--row-accent" as string]: a.accent, ["--row-font" as string]: `var(--font-${a.slug})` }} aria-labelledby={`apt-${a.slug}`}>
                    <div className="apt-media rv">
                      {main ? (
                        <>
                          <Link href={`/${lang}/apartments/${a.slug}`} className="main" tabIndex={-1} aria-hidden="true">
                            <Image src={main.src} alt={c.alts[0] ?? a.name} width={main.w} height={main.h} sizes="(max-width: 860px) 66vw, 36vw" />
                          </Link>
                          {rest.slice(0, 2).map((g, j) => (
                            <Link key={g.src} href={`/${lang}/apartments/${a.slug}`} className="side" tabIndex={-1} aria-hidden="true">
                              <Image src={g.src} alt={c.alts[j + 1] ?? a.name} width={g.w} height={g.h} sizes="(max-width: 860px) 33vw, 18vw" />
                            </Link>
                          ))}
                        </>
                      ) : (
                        <PinkPlaceholder />
                      )}
                    </div>
                    <div className="apt-copy">
                      <p className="apt-num with-mark rv"><AptMark slug={a.slug} size={40} />{a.number}</p>
                      <h3 id={`apt-${a.slug}`} className="display h2 rv d1">
                        <Link href={`/${lang}/apartments/${a.slug}`}><AptName slug={a.slug} name={a.name} /></Link>
                      </h3>
                      <p className="eyebrow rv d1">{c.tagline}</p>
                      <p className="lead rv d2">{c.intro}</p>
                      {!a.comingSoon ? (
                        <ul className="facts rv d2">
                          <li>{t.apartments.upTo(a.maxGuests)}</li>
                          <li>{t.apartments.bedrooms(a.bedrooms)}</li>
                          {a.sizeM2 ? <li>{a.sizeM2} m²</li> : null}
                        </ul>
                      ) : null}
                      <div className="rv d3">
                        <div style={{ display: "grid", gap: "1rem", justifyItems: "start" }}>
                          {prices[i] ? (
                            <p className="price-from">
                              {t.apartments.from} <strong>{money(prices[i]!, lang)}</strong> / {t.apartments.perNight}
                            </p>
                          ) : null}
                          <div className="actions">
                            <Link href={`/${lang}/apartments/${a.slug}`} className={`btn ${a.comingSoon ? "ghost" : ""}`}>{t.apartments.discover}</Link>
                            {!a.comingSoon ? <Link href={`/${lang}/apartments/${a.slug}#availability`} className="btn ghost">{t.apartments.checkAvailability}</Link> : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="reviews-title" style={{ background: "var(--ink-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="wrap">
            <div className="section-head" style={{ gridTemplateColumns: "1fr auto", alignItems: "end" }}>
              <div style={{ display: "grid", gap: "1.2rem" }}>
                <p className="eyebrow rv">{t.reviews.eyebrow}</p>
                <h2 id="reviews-title" className="display h2 rv d1">{t.reviews.title}</h2>
              </div>
              <p className="score rv d2" aria-hidden="true"><strong>8.9</strong><span className="muted">/ 10</span></p>
            </div>
            <ul className="reviews">
              {t.reviews.items.map((r, i) => (
                <li key={r.who} className={`rv d${(i % 3) + 1}`}>
                  <figure className="review">
                    <blockquote>“{r.text}”</blockquote>
                    <figcaption>{r.who}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
            <div className="facts rv" style={{ marginTop: "3rem" }}>
              {t.reviews.scores.map((s) => (
                <span key={s.label} style={{ display: "inline-flex", gap: "0.5rem", alignItems: "baseline" }}>
                  <span>{s.label}</span><strong style={{ color: "var(--bone)", fontWeight: 400 }}>{s.value}</strong>
                </span>
              ))}
              <a className="link" href="https://www.booking.com/hotel/ro/serenity-house-apartments.html#tab-reviews" target="_blank" rel="noopener">{t.reviews.source}</a>
            </div>
          </div>
        </section>

        <section className="section" id="sibiu" aria-labelledby="sibiu-title">
          <div className="wrap sibiu">
            <div className="sibiu-text">
              <p className="eyebrow rv">{t.why.eyebrow}</p>
              <h2 id="sibiu-title" className="display h2 rv d1">{t.why.title}</h2>
              {t.why.text.map((p, i) => <p key={i} className="lead rv d2">{p}</p>)}
            </div>
            <ul className="sibiu-facts">
              {t.why.facts.map((f, i) => <li key={f} className={`rv d${(i % 3) + 1}`}>{f}</li>)}
            </ul>
          </div>
          <div className="wrap">
            <SibiuPhotos lang={lang} />
          </div>
        </section>

        <section className="section" id="faq" aria-labelledby="faq-title" style={{ paddingTop: 0 }}>
          <div className="wrap" style={{ maxWidth: 980 }}>
            <div className="section-head">
              <p className="eyebrow rv">{t.faq.eyebrow}</p>
              <h2 id="faq-title" className="display h2 rv d1">{t.faq.title}</h2>
            </div>
            <div className="faq rv">
              {t.faq.items.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-title" style={{ background: "linear-gradient(180deg, var(--ink), var(--plum))" }}>
          <div className="wrap contact">
            <div style={{ display: "grid", gap: "1.3rem" }}>
              <p className="eyebrow rv">{t.contact.eyebrow}</p>
              <h2 id="contact-title" className="display h2 rv d1">{t.contact.title}</h2>
              <p className="lead rv d2">{t.contact.lead}</p>
              <p className="rv d3 muted">
                {t.contact.orEmail} <a className="link" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </p>
            </div>
            <div className="rv d2">
              <ContactForm lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} t={t} />
    </>
  );
}

/** Pink Panther has no photos yet: a quiet drawn panel instead of a stock image. */
function PinkPlaceholder() {
  return (
    <div className="main" style={{ gridColumn: "1 / -1", aspectRatio: "5 / 4", background: "radial-gradient(120% 90% at 30% 20%, #4a2738 0%, #2a1621 45%, var(--ink-2) 100%)", display: "grid", placeItems: "center", border: "1px solid var(--line)" }}>
      <svg viewBox="0 0 120 120" width="120" height="120" aria-hidden="true" style={{ opacity: 0.8 }}>
        <circle cx="60" cy="60" r="44" fill="none" stroke="#C48A9A" strokeWidth="0.8" />
        <path d="M30 70 Q60 30 90 70 Z" fill="#C48A9A" opacity="0.18" />
        <path d="M42 70 Q60 46 78 70 Z" fill="#C48A9A" opacity="0.35" />
        <path d="M52 70 Q60 60 68 70 Z" fill="#f0ce8a" opacity="0.9" />
      </svg>
    </div>
  );
}
