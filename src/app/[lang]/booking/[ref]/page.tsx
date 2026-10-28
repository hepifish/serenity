import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import BookingStatus from "@/components/BookingStatus";
import { getDict } from "@/i18n";
import { isLocale } from "@/i18n/config";
import { APARTMENTS, isApartmentSlug } from "@/lib/apartments";
import { getGroupByRef } from "@/lib/bookings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

type Props = { params: Promise<{ lang: string; ref: string }>; searchParams: Promise<{ t?: string }> };

/** Where Netopia sends the guest back. The truth arrives by IPN; this page waits for it. */
export default async function BookingPage({ params, searchParams }: Props) {
  const { lang, ref } = await params;
  const { t: token = "" } = await searchParams;
  if (!isLocale(lang)) notFound();
  const group = await getGroupByRef(ref, token);
  if (!group) notFound();
  const b = group[0];
  const t = getDict(lang);
  const apt = group.length === 1 && isApartmentSlug(b.apartment) ? APARTMENTS[b.apartment] : null;
  const names = group.map((r) => (isApartmentSlug(r.apartment) ? APARTMENTS[r.apartment].name : r.apartment)).join(" + ");
  const expired = b.status === "pending" && b.hold_until < new Date() && !b.netopia_status;
  return (
    <>
      <Header lang={lang} t={t.nav} solid />
      <main className={apt ? `theme-${apt.slug}` : undefined}>
        <BookingStatus
          lang={lang}
          ref_={b.group_ref}
          token={token}
          initial={expired ? "expired" : b.status}
          apartment={names}
          slug={apt ? b.apartment : ""}
          checkIn={b.check_in}
          checkOut={b.check_out}
          amount={group.reduce((sum, r) => sum + Number(r.amount), 0)}
        />
      </main>
    </>
  );
}
