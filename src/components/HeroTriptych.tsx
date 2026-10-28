import Image from "next/image";
import AptName from "./AptName";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { apartmentCopy } from "@/i18n/apartments";
import { apartmentList } from "@/lib/apartments";

/**
 * The hero's right half: the apartments themselves, one tall panel each. The
 * hovered panel widens like a door opening; each one leads to its apartment.
 */
export default function HeroTriptych({ lang }: { lang: Locale }) {
  const apts = apartmentList().filter((a) => a.gallery.length);
  return (
    <div className="triptych" role="list">
      {apts.map((a, i) => {
        const photo = a.gallery[a.heroIndex ?? 1] ?? a.gallery[0];
        return (
          <Link key={a.slug} href={`/${lang}/apartments/${a.slug}`} className="panel-door" role="listitem" style={{ ["--door" as string]: a.accent }}>
            <Image src={photo.src} alt={apartmentCopy(lang, a.slug).alts[a.heroIndex ?? 1] ?? a.name} fill priority={i === 0} sizes="(max-width: 900px) 50vw, 30vw" style={{ objectFit: "cover", objectPosition: a.heroFocus ?? "center" }} />
            <span className="door-dim" aria-hidden="true" />
            <span className="door-label">
              <small>{a.number}</small>
              <span className="door-name" style={{ fontFamily: `var(--font-${a.slug})` }}><AptName slug={a.slug} name={a.name} /></span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
