import Image from "next/image";
import AptName from "./AptName";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { apartmentCopy } from "@/i18n/apartments";
import { apartmentList } from "@/lib/apartments";

/**
 * object-fit: cover scales a photo to the panel's full height, so the pixels
 * it needs are set by the height and the photo's shape, not by the narrow
 * panel width: a square tile on a phone, the hero's height (viewport minus
 * header) on a wide screen.
 */
const coverSizes = (aspect: number) =>
  `(max-width: 900px) ${Math.round(50 * Math.max(1, aspect))}vw, calc((100vh - 68px) * ${aspect.toFixed(2)})`;

/** "55% 40%" as --fx: 0.55 and --fy: 40%, so the CSS can aim the crop inside a wider box (see .door-photo). */
const focusVars = (focus = "50% 50%") => {
  const [x, y = "50%"] = focus.split(" ");
  return { ["--fx" as string]: parseFloat(x) / 100, ["--fy" as string]: y };
};

/**
 * The hero's right half: the apartments themselves, one tall panel each. The
 * hovered panel widens like a door opening (see .door-photo in globals.css);
 * each one leads to its apartment.
 */
export default function HeroTriptych({ lang }: { lang: Locale }) {
  const apts = apartmentList().filter((a) => a.gallery.length);
  return (
    <div className="triptych" role="list">
      {apts.map((a, i) => {
        const photo = a.gallery[a.heroIndex ?? 1] ?? a.gallery[0];
        return (
          <Link key={a.slug} href={`/${lang}/apartments/${a.slug}`} className="panel-door" role="listitem" style={{ ["--door" as string]: a.accent, ["--j" as string]: i, ...focusVars(a.heroFocus) }}>
            <span className="door-photo">
              <Image src={photo.src} alt={apartmentCopy(lang, a.slug).alts[a.heroIndex ?? 1] ?? a.name} fill preload={i === 0} fetchPriority={i === 0 ? "high" : "auto"} loading="eager" sizes={coverSizes(photo.w / photo.h)} style={{ objectFit: "cover" }} />
            </span>
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
