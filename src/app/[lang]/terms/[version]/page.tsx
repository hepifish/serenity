import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TERMS_VERSIONS, isTermsVersion } from "@/content/terms";
import { LOCALES, isLocale } from "@/i18n/config";
import TermsView from "@/components/TermsView";

type Params = { params: Promise<{ lang: string; version: string }> };

// Permanent link to the exact text a guest accepted (sent in the confirmation email).
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => Object.keys(TERMS_VERSIONS).map((version) => ({ lang, version })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { lang, version } = await params;
  if (!isLocale(lang) || !isTermsVersion(version)) return {};
  return { title: `${TERMS_VERSIONS[version][lang].title} ${version} · Serenity Apartments Sibiu`, robots: { index: false, follow: true } };
}

export default async function TermsVersionPage({ params }: Params) {
  const { lang, version } = await params;
  if (!isLocale(lang) || !isTermsVersion(version)) notFound();
  return <TermsView lang={lang} version={version} />;
}
