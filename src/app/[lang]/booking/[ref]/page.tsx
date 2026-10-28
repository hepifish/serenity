import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import BookingStatus from "@/components/BookingStatus";
import { getDict } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { getBookingByRef } from "@/lib/bookings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ lang: string; ref: string }>; searchParams: Promise<{ t?: string }> };

/** Where Netopia sends the guest back. The truth arrives by IPN; this page waits for it. */
export default async function BookingPage({ params, searchParams }: Props) {
  const { lang, ref } = await params;
  const { t: token = "" } = await searchParams;
  if (!isLocale(lang)) notFound();
  const b = await getBookingByRef(ref, token);
  if (!b) notFound();
  const t = getDict(lang);
  const apt = isApartmentSlug(b.apartment) ? APARTMENTS[b.apartment] : null;
  const expired = b.status === "pending" && b.hold_until < new Date() && !b.netopia_status;
  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main style={{ ["--accent" as string]: apt?.accent ?? "var(--gold)" }}>
        <BookingStatus
          lang={lang}
          ref_={b.ref}
          token={token}
          initial={expired ? "expired" : b.status}
          apartment={apt?.name ?? b.apartment}
          slug={b.apartment}
          checkIn={b.check_in}
          checkOut={b.check_out}
          amount={Number(b.amount)}
        />
      </main>
    </>
  );
}
