import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import photos from "@/lib/sibiu-photos.json";
import SibiuCarousel from "./SibiuCarousel";

/** Real photographs of Sibiu from Wikimedia Commons, each credited as CC BY / CC BY-SA require. */
export default function SibiuPhotos({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const slides = photos.map((p) => ({
    src: p.src, w: p.w, h: p.h, author: p.author, license: p.license, source: p.source,
    alt: lang === "ro" ? p.alt_ro : lang === "de" ? p.alt_de : p.alt_en,
  }));
  return <SibiuCarousel slides={slides} labels={{ prev: t.why.prevPhoto, next: t.why.nextPhoto, photo: t.why.photoBy, of: "/" }} />;
}
