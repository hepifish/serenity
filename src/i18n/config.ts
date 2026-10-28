export const LOCALES = ["en", "ro", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(s: string | undefined): s is Locale {
  return !!s && (LOCALES as readonly string[]).includes(s);
}

/** hreflang: language only, so the German pages also match Austria and Switzerland. */
export const HREFLANG: Record<Locale, string> = { en: "en", ro: "ro", de: "de" };
/** Open Graph wants language_TERRITORY. */
export const OG_LOCALE: Record<Locale, string> = { en: "en_GB", ro: "ro_RO", de: "de_DE" };
export const LOCALE_NAME: Record<Locale, string> = { en: "English", ro: "Română", de: "Deutsch" };
