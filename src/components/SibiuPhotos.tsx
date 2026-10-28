import Image from "next/image";
import type { Locale } from "@/i18n/config";
import photos from "@/lib/sibiu-photos.json";

type Photo = (typeof photos)[number];

// Night and dusk only: the daylight skyline fights the page's palette.
const ORDER = ["01-eyes-night", "02-piata-mare", "05-christmas", "04-bridge-of-lies"];

/**
 * Real photographs of Sibiu from Wikimedia Commons. Each one carries its
 * author and licence under it, as CC BY and CC BY-SA require.
 */
export default function SibiuPhotos({ lang, label }: { lang: Locale; label: string }) {
  const list = ORDER.map((k) => photos.find((p) => p.src.includes(k))).filter(Boolean) as Photo[];
  const alt = (p: Photo) => (lang === "ro" ? p.alt_ro : lang === "de" ? p.alt_de : p.alt_en);
  return (
    <div className="sibiu-photos">
      {list.map((p, i) => (
        <figure key={p.src} className={`sp sp-${i + 1} rv ${i % 2 ? "d1" : ""}`}>
          <div className="sp-img">
            <Image src={p.src} alt={alt(p)} width={p.w} height={p.h} sizes={i === 0 || i === 3 ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 42vw"} />
          </div>
          <figcaption>
            <span>{alt(p)}</span>
            <a href={p.source} target="_blank" rel="noopener">
              {label} {p.author} · {p.license}
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
