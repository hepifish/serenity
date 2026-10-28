import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckinForm from "@/components/CheckinForm";
import { getDict } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { apartmentList, isApartmentSlug } from "@/lib/apartments";
import { isISODate } from "@/lib/dates";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getDict(lang).checkin.meta, robots: { index: false, follow: false }, alternates: alternates(lang, "/checkin") };
}

/**
 * One link for every guest, direct or Booking.com: /ro/checkin. It can be
 * prefilled, e.g. /en/checkin?ref=SR-ABC12&apt=film-studio&arrival=2026-12-14&source=direct
 */
export default async function CheckinPage({ params, searchParams }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const q = await searchParams;
  const t = getDict(lang);
  const prefill = {
    reservation: q.ref?.slice(0, 40),
    apartment: q.apt && isApartmentSlug(q.apt) ? q.apt : undefined,
    arrival: isISODate(q.arrival) ? q.arrival : undefined,
    source: q.source === "direct" || q.source === "booking" || q.source === "other" ? q.source : undefined,
  };
  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className="checkout">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <p className="eyebrow">{t.checkin.eyebrow}</p>
            <h1 className="display h2">{t.checkin.title}</h1>
            <p className="lead">{t.checkin.lead}</p>
          </div>
          <CheckinForm lang={lang} prefill={prefill} apartments={apartmentList().map((a) => ({ slug: a.slug, name: a.name }))} />
        </div>
      </main>
      <Footer lang={lang} t={t} />
    </>
  );
}
