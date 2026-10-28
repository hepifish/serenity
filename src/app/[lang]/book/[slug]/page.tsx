import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";
import { getDict } from "@/i18n";
import { apartmentCopy } from "@/i18n/apartments";
import { isLocale } from "@/i18n/config";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { isStayFree } from "@/lib/availability";
import { longDate, money } from "@/lib/format";
import { getRate, quote } from "@/lib/pricing";
import { checkStay } from "@/lib/stay";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ lang: string; slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export default async function BookPage({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const q = await searchParams;
  if (!isLocale(lang) || !isApartmentSlug(slug) || APARTMENTS[slug].comingSoon) notFound();
  const t = getDict(lang);
  const a = APARTMENTS[slug];
  const back = `/${lang}/apartments/${slug}`;

  const guests = Number(q.guests ?? 2);
  const rate = await getRate(slug);
  if (!rate || checkStay(slug, q.in, q.out, guests, rate.min_nights)) redirect(`${back}#availability`);
  const free = await isStayFree(slug, q.in!, q.out!).catch(() => false);
  if (!free) redirect(`${back}?in=${q.in}&out=${q.out}#availability`);
  const quoteResult = await quote(slug, q.in!, q.out!, guests);
  if (!quoteResult) redirect(back);
  const qq = quoteResult;

  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className="checkout" style={{ ["--accent" as string]: a.accent }}>
        <div className="wrap">
          <p className="crumbs" style={{ marginBottom: "1rem" }}><Link href={`${back}?in=${qq.checkIn}&out=${qq.checkOut}&guests=${guests}`}>← {a.name}</Link></p>
          <h1 className="display h2" style={{ marginBottom: "clamp(2rem, 5vw, 3.5rem)" }}>{t.checkout.title}</h1>
          <div className="checkout-grid">
            <CheckoutForm lang={lang} slug={slug} checkIn={qq.checkIn} checkOut={qq.checkOut} guests={guests} total={qq.total} />
            <aside className="checkout-aside" aria-label={t.checkout.stay}>
              {a.gallery[0] ? <Image src={a.gallery[0].src} alt="" width={a.gallery[0].w} height={a.gallery[0].h} sizes="380px" /> : null}
              <div className="inner">
                <div>
                  <p className="eyebrow">{apartmentCopy(lang, slug).tagline}</p>
                  <p className="display h3" style={{ marginTop: "0.5rem" }}>{a.name}</p>
                </div>
                <div className="summary">
                  <div className="summary-row"><span>{t.search.checkIn}</span><span>{longDate(qq.checkIn, lang)}</span></div>
                  <div className="summary-row"><span>{t.search.checkOut}</span><span>{longDate(qq.checkOut, lang)}</span></div>
                  <div className="summary-row"><span>{t.search.guests}</span><span>{guests}</span></div>
                  <Link href={`${back}?in=${qq.checkIn}&out=${qq.checkOut}&guests=${guests}#availability`} className="link" style={{ justifySelf: "start", fontSize: "0.85rem" }}>{t.checkout.change}</Link>
                </div>
                <div className="summary" style={{ borderTop: "1px solid var(--line)", paddingTop: "1rem" }}>
                  <div className="summary-row"><span>{t.apartment.lodging} · {t.apartment.nightsLabel(qq.nights)}</span><span>{money(qq.lodging, lang)}</span></div>
                  {qq.cleaning ? <div className="summary-row"><span>{t.apartment.cleaning}</span><span>{money(qq.cleaning, lang)}</span></div> : null}
                  <div className="summary-row"><span>{t.apartment.cityTax}</span><span>{money(qq.cityTax, lang, true)}</span></div>
                  <p className="tax-note">{t.apartment.cityTaxNote}</p>
                  <div className="summary-row total"><span>{t.apartment.total}</span><strong>{money(qq.total, lang, true)}</strong></div>
                </div>
                <p className="tax-note">{t.apartment.rules[0]}<br />{t.apartment.rules[3]}</p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
