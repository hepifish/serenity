import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TermsView from "@/components/TermsView";
import { TERMS_VERSION, currentTerms } from "@/content/terms";
import { isLocale, type Locale } from "@/i18n/config";
import { pageMeta } from "@/lib/seo";

type Params = { params: Promise<{ lang: string }> };

const DESCRIPTION: Record<Locale, string> = {
  ro: "Termenii și condițiile pentru rezervările directe la Serenity Apartments Sibiu: plată, anulare, rambursare, pagube și regulile casei.",
  en: "Terms and conditions for direct bookings at Serenity Apartments Sibiu: payment, cancellation, refunds, damage and house rules.",
  de: "Allgemeine Geschäftsbedingungen für Direktbuchungen bei Serenity Apartments Sibiu: Zahlung, Stornierung, Erstattung, Schäden und Hausordnung.",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return pageMeta(lang, "/terms", `${currentTerms(lang).title} · Serenity Apartments Sibiu`, DESCRIPTION[lang]);
}

export default async function TermsPage({ params }: Params) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <TermsView lang={lang} version={TERMS_VERSION} />;
}
