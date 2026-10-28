// Positions come from a hash of the index, not Math.random(), so the server
// and the browser draw the same sky. Rounded, because React serialises long
// floats into the style attribute differently on each side.
const scatter = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const r = (n: number, p = 3) => Number(n.toFixed(p));

const STARS = Array.from({ length: 70 }, (_, i) => ({
  left: r(scatter(i) * 100),
  top: r(scatter(i + 71) * 62),
  size: r(1 + scatter(i + 149) * 1.4, 2),
  opacity: r(0.18 + scatter(i + 233) * 0.42),
  d: r(2 + scatter(i + 317) * 3, 2),
  dl: r(scatter(i + 419) * 2, 2),
}));

export default function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity, ["--d" as string]: `${s.d}s`, ["--dl" as string]: `${s.dl}s` }}
        />
      ))}
    </div>
  );
}
