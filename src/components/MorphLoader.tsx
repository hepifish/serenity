import { APARTMENTS } from "@/lib/apartments";
import { MARKS, MARK_GRID, MARK_ORDER } from "@/lib/marks";
import AptMark, { markStroke } from "./AptMark";
import "./marks.css";

/*
  The four marks morphing into one another: film camera, gothic arch, framed
  brushstroke, seated panther, and round again. Pure SVG + SMIL so it runs
  before (and without) JavaScript and in Safari, which cannot animate CSS
  `d`. Every mark shares one path structure (see scripts/marks.mjs), so `d`
  interpolates point by point.

  While the line changes shape both its ends draw back, like a pen lifting
  off the paper, then grow out again and hold the new mark in that
  apartment's colour.
*/

const HOLD = 0.75; // s each mark rests
const MORPH = 0.95; // s each change takes
const DRAW = 1.0; // s of the first stroke drawing itself
const CYCLE = MARK_ORDER.length * (HOLD + MORPH);
const BEGIN = `${DRAW + 0.3}s`; // after the reveal delay and the first draw

const r = (n: number) => +(n / CYCLE).toFixed(4);
const EASE = "0.65 0 0.35 1";
const FLAT = "0 0 1 1";

// d and colour: hold, morph, hold, morph...
const shapes = [...MARK_ORDER, MARK_ORDER[0]];
const shapeTimes: number[] = [];
const shapeSplines: string[] = [];
const dValues: string[] = [];
const colours: string[] = [];
MARK_ORDER.forEach((slug, i) => {
  const t0 = i * (HOLD + MORPH);
  shapeTimes.push(r(t0), r(t0 + HOLD));
  shapeSplines.push(FLAT, EASE);
  dValues.push(MARKS[slug], MARKS[slug]);
  colours.push(APARTMENTS[slug].accent, APARTMENTS[slug].accent);
});
shapeTimes.push(1);
dValues.push(MARKS[shapes[shapes.length - 1]]);
colours.push(APARTMENTS[shapes[shapes.length - 1]].accent);

// The pen lifts: mid-morph only the stretch from LIFT to LIFT + PEN of the line
// shows, so both loose ends (where the marks differ most) fade out of the
// in-between shapes and grow back as the new mark settles.
const PEN = 0.62;
const LIFT = 0.12;
const dashTimes: number[] = [];
const dashValues: string[] = [];
const offsetValues: string[] = [];
const dashSplines: string[] = [];
MARK_ORDER.forEach((_, i) => {
  const t0 = i * (HOLD + MORPH);
  dashTimes.push(r(t0), r(t0 + HOLD), r(t0 + HOLD + MORPH / 2));
  dashValues.push("1 0", "1 0", `${PEN} ${1 - PEN}`);
  offsetValues.push("0", "0", `${-LIFT}`);
  dashSplines.push(FLAT, "0.5 0 0.5 1", "0.5 0 0.5 1");
});
dashTimes.push(1);
dashValues.push("1 0");
offsetValues.push("0");

type Props = {
  /** rendered size in px */
  size?: number;
  /** a short line under the mark; it is also the status text for screen readers */
  label?: React.ReactNode;
  /** accessible name when there is no visible label */
  srLabel?: string;
  /** fade in only after ~300 ms so fast responses never flash it */
  delay?: boolean;
  className?: string;
};

export default function MorphLoader({ size = 72, label, srLabel, delay = true, className }: Props) {
  const stroke = markStroke(size);
  return (
    <div
      className={`morph${delay ? " morph-delay" : ""}${className ? ` ${className}` : ""}`}
      role="status"
      aria-live="polite"
      aria-label={label ? undefined : srLabel}
    >
      <svg className="morph-anim" viewBox={`0 0 ${MARK_GRID} ${MARK_GRID}`} width={size} height={size} aria-hidden="true" focusable="false">
        <path
          d={MARKS[MARK_ORDER[0]]}
          pathLength={1}
          fill="none"
          stroke={APARTMENTS[MARK_ORDER[0]].accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0 1"
        >
          {/* the first stroke draws itself */}
          <animate attributeName="stroke-dasharray" values="0 1;1 0" dur={`${DRAW}s`} begin="0.3s" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" fill="freeze" />
          <animate attributeName="d" values={dValues.join(";")} keyTimes={shapeTimes.join(";")} calcMode="spline" keySplines={shapeSplines.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke" values={colours.join(";")} keyTimes={shapeTimes.join(";")} calcMode="spline" keySplines={shapeSplines.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke-dasharray" values={dashValues.join(";")} keyTimes={dashTimes.join(";")} calcMode="spline" keySplines={dashSplines.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values={offsetValues.join(";")} keyTimes={dashTimes.join(";")} calcMode="spline" keySplines={dashSplines.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
        </path>
      </svg>
      {/* reduced motion: one mark, breathing */}
      <AptMark slug={MARK_ORDER[0]} size={size} className="morph-still" />
      {label ? <p className="morph-label">{label}</p> : null}
    </div>
  );
}
