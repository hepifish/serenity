// The four apartment marks: one continuous line each, drawn on a 48 grid.
//
// Every mark is resampled to the SAME structure (one M, then N cubic
// segments) so the loader can morph between them by interpolating `d`
// (SMIL, which Safari supports; CSS `d` animation it does not).
//
//   node scripts/marks.mjs          writes src/lib/marks.ts + public/marks/*.svg
//   node scripts/marks.mjs --json   prints the normalised paths (for previews)
//
// Each route starts bottom-left, climbs the left side, crosses the top,
// comes down the right and ends with its inner detail, so the morph keeps
// the line flowing the same way and never tangles.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const N = 120; // cubic segments per mark
const GRID = 48;

const L = (x, y) => ({ t: "L", p: [x, y] });
const C = (x1, y1, x2, y2, x, y) => ({ t: "C", c1: [x1, y1], c2: [x2, y2], p: [x, y] });
/** circular arc around (cx, cy), radius r, from angle a0 to a1 in degrees (screen coords) */
const A = (cx, cy, r, a0, a1) => ({ t: "A", cx, cy, r, a0, a1 });

/**
 * A pointed (lancet) arch springing at height sy, half-span w, radius R >= w.
 * dir +1 runs left to right over the apex, -1 right to left.
 */
function lancet(cx, sy, w, R, dir) {
  const a = (Math.acos((R - w) / R) * 180) / Math.PI; // how far each arc turns
  const left = A(cx - w + R, sy, R, 180, 180 + a); // from the left springer up to the apex
  const right = A(cx + w - R, sy, R, 360 - a, 360); // from the apex down to the right springer
  if (dir > 0) return [left, right];
  return [A(right.cx, sy, R, 360, right.a0), A(left.cx, sy, R, left.a1, 180)];
}

const SHAPES = {
  // 01 · a hand-cranked cinema camera on its tripod: two reels, a hooded lens
  "film-studio": {
    start: [13, 44],
    segs: [
      L(21.5, 30),
      L(13, 30),
      L(13, 19),
      L(17, 19),
      A(17, 15, 4, 90, 450),
      L(27, 19),
      A(27, 14, 5, 90, 450),
      L(30, 19),
      L(30, 22),
      L(33, 22),
      L(36.5, 19.8),
      L(36.5, 29.2),
      L(33, 27),
      L(30, 27),
      L(30, 30),
      L(21.5, 30),
      L(30, 44),
    ],
  },
  // 02 · a lancet arch over a recessed inner arch: the vaulted doorway
  "gothic-chambers": {
    start: [13, 41],
    segs: [
      L(13, 24),
      ...lancet(24, 24, 11, 22, +1),
      L(35, 41),
      L(18.5, 41),
      L(18.5, 29.5),
      ...lancet(24, 29.5, 5.5, 11, +1),
      L(29.5, 41),
    ],
  },
  // 03 · an easel on three legs holding an empty canvas, its mast peaking above.
  // Two legs are drawn down and back up the same line, so it stays one stroke.
  "art-station": {
    start: [35.5, 44],
    segs: [
      L(30.61, 27),
      L(24, 27),
      L(24, 41),
      L(24, 27),
      L(17.39, 27),
      L(12.5, 44),
      L(17.39, 27),
      L(16, 27),
      L(16, 12),
      L(22.6, 12),
      L(24, 7),
      L(25.4, 12),
      L(32, 12),
      L(32, 27),
      L(30.61, 27),
    ],
  },
  // 04 · a panther seated tall: long neck, ears set wide and pointed, the tail
  // rising beside it in one long S. Original, not the film character.
  "pink-panther": {
    start: [16, 43],
    segs: [
      C(14.4, 37, 14.6, 30, 17.2, 24.5),
      C(15.4, 22.4, 14.6, 20, 15, 17.2),
      L(13.9, 7.4),
      L(17.8, 11),
      L(21.2, 11),
      L(25.1, 7.4),
      C(25.2, 10.2, 25.2, 13.5, 24.6, 15.5),
      C(24.2, 17, 23.2, 18, 23.2, 19.6),
      C(23.2, 21.4, 23.6, 22.8, 24.4, 24),
      C(29.5, 27.5, 33.2, 32, 32.8, 37),
      C(32.6, 40.4, 30.6, 43, 27, 43),
      C(32, 43, 36.6, 42.6, 37.4, 38.4),
      C(38.2, 34, 34.6, 30, 35.2, 24.4),
      C(35.7, 19.6, 40, 18, 40.4, 13),
      C(40.6, 10.6, 39, 9.6, 37.8, 10.6),
    ],
  },
};
export const ORDER = ["film-studio", "gothic-chambers", "art-station", "pink-panther"];

// ---------- geometry ----------
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function arcToCubics(s) {
  const out = [];
  const total = s.a1 - s.a0;
  const n = Math.max(1, Math.ceil(Math.abs(total) / 90));
  const step = ((total / n) * Math.PI) / 180;
  const k = (4 / 3) * Math.tan(step / 4);
  let a = (s.a0 * Math.PI) / 180;
  for (let i = 0; i < n; i++) {
    const b = a + step;
    const p0 = [s.cx + s.r * Math.cos(a), s.cy + s.r * Math.sin(a)];
    const p3 = [s.cx + s.r * Math.cos(b), s.cy + s.r * Math.sin(b)];
    out.push({
      p0,
      c1: [p0[0] - k * s.r * Math.sin(a), p0[1] + k * s.r * Math.cos(a)],
      c2: [p3[0] + k * s.r * Math.sin(b), p3[1] - k * s.r * Math.cos(b)],
      p: p3,
    });
    a = b;
  }
  return out;
}

/** every shape as absolute cubics {p0,c1,c2,p} */
function toCubics(shape) {
  let cur = shape.start;
  const out = [];
  for (const s of shape.segs) {
    if (s.t === "L") {
      out.push({ p0: cur, c1: lerp(cur, s.p, 1 / 3), c2: lerp(cur, s.p, 2 / 3), p: s.p });
      cur = s.p;
    } else if (s.t === "C") {
      out.push({ p0: cur, c1: s.c1, c2: s.c2, p: s.p });
      cur = s.p;
    } else {
      const arcs = arcToCubics(s);
      arcs[0].p0 = cur; // snap to the previous point
      out.push(...arcs);
      cur = arcs[arcs.length - 1].p;
    }
  }
  return out;
}

const bez = (c, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * c.p0[i] + 3 * u * u * t * c.c1[i] + 3 * u * t * t * c.c2[i] + t * t * t * c.p[i]);
};
function cubicLength(c, steps = 64) {
  let len = 0;
  let prev = c.p0;
  for (let i = 1; i <= steps; i++) {
    const q = bez(c, i / steps);
    len += Math.hypot(q[0] - prev[0], q[1] - prev[1]);
    prev = q;
  }
  return len;
}
/** t at which the cubic has covered `frac` of its length */
function tAtFraction(c, frac, steps = 200) {
  if (frac <= 0) return 0;
  if (frac >= 1) return 1;
  const total = cubicLength(c, steps);
  let len = 0;
  let prev = c.p0;
  for (let i = 1; i <= steps; i++) {
    const q = bez(c, i / steps);
    const d = Math.hypot(q[0] - prev[0], q[1] - prev[1]);
    if (len + d >= frac * total) return (i - 1 + (frac * total - len) / d) / steps;
    len += d;
    prev = q;
  }
  return 1;
}
/** the piece of cubic c between t0 and t1 */
function subCubic(c, t0, t1) {
  const split = (c, t) => {
    const a = lerp(c.p0, c.c1, t), b = lerp(c.c1, c.c2, t), d = lerp(c.c2, c.p, t);
    const e = lerp(a, b, t), f = lerp(b, d, t), g = lerp(e, f, t);
    return [{ p0: c.p0, c1: a, c2: e, p: g }, { p0: g, c1: f, c2: d, p: c.p }];
  };
  const right = split(c, t0)[1];
  return split(right, (t1 - t0) / (1 - t0 || 1))[0];
}

/** resample to exactly N cubics, pieces allotted by length (each source piece gets at least one) */
function normalise(cubics) {
  const lens = cubics.map((c) => cubicLength(c));
  const total = lens.reduce((a, b) => a + b, 0);
  const counts = lens.map(() => 1);
  let left = N - cubics.length;
  if (left < 0) throw new Error(`N=${N} is smaller than ${cubics.length} source segments`);
  const ideal = lens.map((l) => (l / total) * N);
  while (left-- > 0) {
    let best = 0, bestGap = -Infinity;
    ideal.forEach((v, i) => { const gap = v - counts[i]; if (gap > bestGap) { bestGap = gap; best = i; } });
    counts[best]++;
  }
  const out = [];
  cubics.forEach((c, i) => {
    const k = counts[i];
    const ts = Array.from({ length: k + 1 }, (_, j) => tAtFraction(c, j / k));
    for (let j = 0; j < k; j++) out.push(subCubic(c, ts[j], ts[j + 1]));
  });
  return out;
}

/** centre the drawing's bounding box on the grid */
function centre(cubics) {
  const pts = cubics.flatMap((c) => Array.from({ length: 17 }, (_, i) => bez(c, i / 16)));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const dx = GRID / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const dy = GRID / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
  const mv = (p) => [p[0] + dx, p[1] + dy];
  return cubics.map((c) => ({ p0: mv(c.p0), c1: mv(c.c1), c2: mv(c.c2), p: mv(c.p) }));
}

const f = (n) => (Math.round(n * 100) / 100).toString();
const pt = (p) => `${f(p[0])} ${f(p[1])}`;
const toD = (cs) => `M${pt(cs[0].p0)}` + cs.map((c) => `C${pt(c.c1)} ${pt(c.c2)} ${pt(c.p)}`).join("");

/** a shape as a normalised, centred path */
export const markPath = (shape) => toD(centre(normalise(toCubics(shape))));
export { L, C, A, lancet };

export const MARKS = Object.fromEntries(ORDER.map((s) => [s, markPath(SHAPES[s])]));

const ACCENT = { "film-studio": "#D9A93B", "gothic-chambers": "#8F6BB0", "art-station": "#C8312C", "pink-panther": "#E39AB4" };

if (process.argv[1] !== fileURLToPath(import.meta.url)) {
  // imported (previews): no output
} else if (process.argv.includes("--json")) {
  console.log(JSON.stringify(MARKS));
} else {
  const ts = `// Generated by scripts/marks.mjs; edit the shapes there and rerun it.
// One continuous line per apartment on a ${GRID} grid, each resampled to ${N}
// cubic segments so any two can be morphed by interpolating \`d\`.
import type { ApartmentSlug } from "./apartments";

export const MARK_GRID = ${GRID};

export const MARKS: Record<ApartmentSlug, string> = {
${ORDER.map((s) => `  "${s}":\n    "${MARKS[s]}",`).join("\n")}
};

/** the loader's sequence */
export const MARK_ORDER: ApartmentSlug[] = ${JSON.stringify(ORDER)};
`;
  writeFileSync(join(ROOT, "src/lib/marks.ts"), ts);
  mkdirSync(join(ROOT, "public/marks"), { recursive: true });
  for (const s of ORDER) {
    // transparent, for pages and documents
    writeFileSync(
      join(ROOT, `public/marks/${s}.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}" fill="none" stroke="${ACCENT[s]}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${MARKS[s]}"/></svg>\n`,
    );
    // on the ink tile, heavier, for browser tabs
    writeFileSync(
      join(ROOT, `public/marks/${s}-icon.svg`),
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${GRID} ${GRID}"><rect width="${GRID}" height="${GRID}" rx="9" fill="#0e0b10"/><path d="${MARKS[s]}" transform="translate(24 24) scale(1.12) translate(-24 -24)" fill="none" stroke="${ACCENT[s]}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>\n`,
    );
  }
  console.log("wrote src/lib/marks.ts and public/marks/*.svg");
}
