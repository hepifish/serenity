import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";
import { getDict } from "@/i18n";
import { apartmentCopy } from "@/i18n/apartments";
import { isLocale } from "@/i18n/config";
import { APARTMENTS, isApartmentSlug, type ApartmentSlug } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { longDate, money } from "@/lib/format";
import { quoteStays } from "@/lib/pricing";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | undefined>> };

/** Checkout for one apartment or several over the same dates. Prices are recomputed here, never carried over. */
export default async function BookPage({ params, searchParams }: Props) {
  const { lang } = await params;
  const q = await searchParams;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  const slugs = [...new Set((q.apts ?? "").split(",").filter(isApartmentSlug))].filter((s) => !APARTMENTS[s].comingSoon) as ApartmentSlug[];
  const guests = Number(q.guests ?? 2);
  const home = `/${lang}?in=${q.in ?? ""}&out=${q.out ?? ""}&guests=${guests}`;
  if (!slugs.length) redirect(home);
  const stays = await quoteStays(slugs, q.in, q.out, guests);
  if ("error" in stays) redirect(home);
  const { quotes, split } = stays;
  for (const slug of slugs) if (!(await isStayFree(slug, q.in!, q.out!).catch(() => false))) redirect(home);
  const total = Math.round(quotes.reduce((s, x) => s + x.total, 0) * 100) / 100;
  const single = slugs.length === 1 ? APARTMENTS[slugs[0]] : null;
  const change = single ? `/${lang}/apartments/${single.slug}?in=${q.in}&out=${q.out}&guests=${guests}#availability` : home;

  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className={`checkout ${single ? `theme-${single.slug}` : ""}`}>
        <div className="wrap">
          <p className="crumbs" style={{ marginBottom: "1rem" }}><Link href={change}>← {single ? single.name : t.results.title}</Link></p>
          <h1 className="display h2" style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>{t.checkout.title}</h1>
          <div className="checkout-grid">
            <CheckoutForm lang={lang} slugs={slugs} checkIn={q.in!} checkOut={q.out!} guests={guests} total={total} />
            <aside className="checkout-aside" aria-label={t.checkout.stay}>
              {slugs.length === 1 && single?.gallery[0] ? (
                <Image src={single.gallery[0].src} alt="" width={single.gallery[0].w} height={single.gallery[0].h} sizes="380px" />
              ) : (
                <div className="aside-strip">
                  {slugs.map((s) => APARTMENTS[s].gallery[0] && <Image key={s} src={APARTMENTS[s].gallery[0].src} alt="" width={APARTMENTS[s].gallery[0].w} height={APARTMENTS[s].gallery[0].h} sizes="200px" />)}
                </div>
              )}
              <div className="inner">
                <div className="summary">
                  <div className="summary-row"><span>{t.search.checkIn}</span><span>{longDate(q.in!, lang)}</span></div>
                  <div className="summary-row"><span>{t.search.checkOut}</span><span>{longDate(q.out!, lang)}</span></div>
                  <div className="summary-row"><span>{t.search.guests}</span><span>{guests}</span></div>
                  <Link href={change} className="link" style={{ justifySelf: "start", fontSize: "0.85rem" }}>{t.checkout.change}</Link>
                </div>
                {quotes.map((x, i) => (
                  <div key={x.apartment} className="summary" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
                    <p className="display" style={{ fontSize: "1.45rem", fontFamily: `var(--font-${x.apartment}), var(--serif)` }}>{APARTMENTS[x.apartment as ApartmentSlug].name}</p>
                    <p className="muted" style={{ fontSize: "0.8rem", marginTop: "-0.3rem" }}>{apartmentCopy(lang, x.apartment as ApartmentSlug).tagline} · {t.search.guest(split[i])}</p>
                    <div className="summary-row"><span>{t.apartment.lodging} · {t.apartment.nightsLabel(x.nights)}</span><span>{money(x.lodging, lang)}</span></div>
                    {x.cleaning ? <div className="summary-row"><span>{t.apartment.cleaning}</span><span>{money(x.cleaning, lang)}</span></div> : null}
                    <div className="summary-row"><span>{t.apartment.cityTax}</span><span>{money(x.cityTax, lang, true)}</span></div>
                  </div>
                ))}
                <p className="tax-note">{t.apartment.cityTaxNote}</p>
                <div className="summary-row total" style={{ display: "flex" }}><span>{t.apartment.total}</span><strong>{money(total, lang, true)}</strong></div>
                <p className="tax-note">{t.apartment.rules[0]}<br />{t.apartment.rules[3]}</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
