export const LOCALES = ["en", "ro", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(s: string | undefined): s is Locale {
  return !!s && (LOCALES as readonly string[]).includes(s);
}

/** Open Graph / hreflang codes. */
export const LOCALE_TAG: Record<Locale, string> = { en: "en", ro: "ro-RO", de: "de-DE" };
export const LOCALE_NAME: Record<Locale, string> = { en: "English", ro: "Română", de: "Deutsch" };
