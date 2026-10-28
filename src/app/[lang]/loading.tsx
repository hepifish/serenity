import MorphLoader from "@/components/MorphLoader";
import { LOCALES } from "@/i18n/config";
import { getDict } from "@/i18n";

/**
 * Shown while a route's server work streams in. It fades in after 300 ms,
 * so on a fast connection nobody ever sees it. loading.tsx gets no params,
 * so all three lines are rendered and CSS keeps the one matching <html lang>.
 */
export default function Loading() {
  return (
    <main className="page-loader">
      <MorphLoader
        size={88}
        label={LOCALES.map((l) => (
          <span key={l} lang={l} className="morph-l">
            {getDict(l).common.opening}
          </span>
        ))}
      />
    </main>
  );
}
