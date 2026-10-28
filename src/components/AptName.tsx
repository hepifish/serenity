/**
 * An apartment's name in its own lettering. Pink Panther's capitals bounce
 * off the baseline one by one, so each letter gets its own span; words stay
 * free to wrap, and screen readers get the plain name.
 */
export default function AptName({ slug, name }: { slug: string; name: string }) {
  if (slug !== "pink-panther") return <>{name}</>;
  return (
    <span className="bounce" aria-label={name}>
      {name.split(" ").map((word, w) => (
        <span key={w} className="bounce-word" aria-hidden="true">
          {[...word].map((c, i) => <span key={i}>{c}</span>)}
        </span>
      )).reduce<React.ReactNode[]>((acc, el, i) => (i ? [...acc, " ", el] : [el]), [])}
    </span>
  );
}
