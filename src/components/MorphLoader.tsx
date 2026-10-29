import { ACCENTS } from "@/lib/accents";
import { MARKS, MARK_GRID, MARK_ORDER } from "@/lib/marks";
import AptMark, { markStroke } from "./AptMark";
import "./marks.css";

/*
  The four marks becoming one another: film camera, gothic arch, easel,
  panther, and round again. Pure SVG + SMIL so it runs before (and without)
  JavaScript and in Safari, which cannot animate CSS `d`. Every mark shares
  one path structure (see scripts/marks.mjs), so `d` can interpolate.

  Each change is written like ink, not bent like wire: the line draws itself
  back into one short stroke at its middle, the shape changes while only that
  stroke is left, and the new mark draws out of it in its own colour.
*/

const HOLD = 1.0; // s each mark rests
const MORPH = 1.4; // s each change takes
const DRAW = 1.0; // s of the first stroke drawing itself
const CYCLE = MARK_ORDER.length * (HOLD + MORPH);
const BEGIN = `${DRAW + 0.3}s`; // after the reveal delay and the first draw

const PEN = 0.07; // what is left of the line mid-change, as a share of its length
const SHIFT_FROM = 0.3; // the shape changes in this stretch of the change...
const SHIFT_TO = 0.7; // ...while the line is at its shortest

const r = (n: number) => +(n / CYCLE).toFixed(4);
const FLAT = "0 0 1 1";
const EASE = "0.65 0 0.35 1";
const ERASE = "0.55 0 0.75 0.9"; // gathers in, quickening
const DRAW_OUT = "0.2 0.3 0.35 1"; // flows out, settling

// d and colour: held, then changed only while the line is short
const timesD: number[] = [];
const splinesD: string[] = [];
const dValues: string[] = [];
const colours: string[] = [];
MARK_ORDER.forEach((slug, i) => {
  const next = MARK_ORDER[(i + 1) % MARK_ORDER.length];
  const t0 = i * (HOLD + MORPH);
  if (i === 0) {
    timesD.push(0);
    dValues.push(MARKS[slug]);
    colours.push(ACCENTS[slug]);
  }
  timesD.push(r(t0 + HOLD + SHIFT_FROM * MORPH), r(t0 + HOLD + SHIFT_TO * MORPH));
  dValues.push(MARKS[slug], MARKS[next]);
  colours.push(ACCENTS[slug], ACCENTS[next]);
  splinesD.push(FLAT, EASE);
});
timesD.push(1);
dValues.push(MARKS[MARK_ORDER[0]]);
colours.push(ACCENTS[MARK_ORDER[0]]);
splinesD.push(FLAT);

// the visible stretch, always centred on the middle of the line
const dash = (v: number) => `${v} ${1 - v}`;
const offset = (v: number) => `${-(0.5 - v / 2)}`;
const timesP: number[] = [];
const splinesP: string[] = [];
const dashValues: string[] = [];
const offsetValues: string[] = [];
MARK_ORDER.forEach((_, i) => {
  const t0 = i * (HOLD + MORPH);
  timesP.push(r(t0), r(t0 + HOLD), r(t0 + HOLD + MORPH / 2));
  dashValues.push(dash(1), dash(1), dash(PEN));
  offsetValues.push(offset(1), offset(1), offset(PEN));
  splinesP.push(FLAT, ERASE, DRAW_OUT);
});
timesP.push(1);
dashValues.push(dash(1));
offsetValues.push(offset(1));

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
          stroke={ACCENTS[MARK_ORDER[0]]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="0 1"
        >
          {/* the first mark draws out from its middle, as every later one does */}
          <animate attributeName="stroke-dasharray" values={`${dash(0)};${dash(1)}`} dur={`${DRAW}s`} begin="0.3s" calcMode="spline" keyTimes="0;1" keySplines={DRAW_OUT} fill="freeze" />
          <animate attributeName="stroke-dashoffset" values={`${offset(0)};${offset(1)}`} dur={`${DRAW}s`} begin="0.3s" calcMode="spline" keyTimes="0;1" keySplines={DRAW_OUT} fill="freeze" />
          <animate attributeName="d" values={dValues.join(";")} keyTimes={timesD.join(";")} calcMode="spline" keySplines={splinesD.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke" values={colours.join(";")} keyTimes={timesD.join(";")} calcMode="spline" keySplines={splinesD.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke-dasharray" values={dashValues.join(";")} keyTimes={timesP.join(";")} calcMode="spline" keySplines={splinesP.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values={offsetValues.join(";")} keyTimes={timesP.join(";")} calcMode="spline" keySplines={splinesP.join(";")} dur={`${CYCLE}s`} begin={BEGIN} repeatCount="indefinite" />
        </path>
      </svg>
      {/* reduced motion: one mark, breathing */}
      <AptMark slug={MARK_ORDER[0]} size={size} className="morph-still" />
      {label ? <p className="morph-label">{label}</p> : null}
    </div>
  );
}
