import { ACCENTS } from "@/lib/accents";
import type { ApartmentSlug } from "@/lib/apartments";
import { MARKS, MARK_GRID } from "@/lib/marks";
import "./marks.css";

type Props = {
  slug: ApartmentSlug;
  /** rendered size in px */
  size?: number;
  /** accessible name; without it the mark is decorative */
  title?: string;
  /** stroke colour; the apartment's accent by default */
  color?: string;
  className?: string;
};

/** Line weight on the 48 grid: 1.5, a little heavier when small so it holds at favicon sizes. */
export const markStroke = (size: number) => (size <= 28 ? 2.25 : size <= 40 ? 1.8 : 1.5);

/** One apartment's mark: a single continuous line in its accent. */
export default function AptMark({ slug, size = 48, title, color, className }: Props) {
  return (
    <svg
      className={`apt-mark${className ? ` ${className}` : ""}`}
      viewBox={`0 0 ${MARK_GRID} ${MARK_GRID}`}
      width={size}
      height={size}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        d={MARKS[slug]}
        fill="none"
        stroke={color ?? ACCENTS[slug]}
        strokeWidth={markStroke(size)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
