/**
 * An apartment's name in its own lettering. Pink Panther's capitals bounce
 * off the baseline one by one, so each letter gets its own span; the full
 * name stays readable to screen readers.
 */
export default function AptName({ slug, name }: { slug: string; name: string }) {
  if (slug !== "pink-panther") return <>{name}</>;
  return (
    <span className="bounce" aria-label={name}>
      {[...name].map((c, i) => (
        <span key={i} aria-hidden="true">{c === " " ? " " : c}</span>
      ))}
    </span>
  );
}
