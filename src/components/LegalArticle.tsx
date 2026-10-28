import type { ReactNode } from "react";
import type { LegalDoc } from "@/content/legal";

/** A legal document as a readable article. `meta` is the line under the title. */
export default function LegalArticle({ doc, meta, notice }: { doc: LegalDoc; meta: string; notice?: ReactNode }) {
  return (
    <article className="prose">
      <h1>{doc.title}</h1>
      <p className="muted">{meta}</p>
      {notice}
      {doc.intro ? <p>{doc.intro}</p> : null}
      {doc.sections.map((s) => {
        const id = s.id ?? slug(s.h);
        return (
          <section key={s.h} aria-labelledby={id} style={{ display: "grid", gap: "1rem" }}>
            <h2 id={id}>{s.h}</h2>
            {s.p?.map((p, i) => <p key={i}>{linkify(p)}</p>)}
            {s.ul ? <ul>{s.ul.map((li, i) => <li key={i}>{linkify(li)}</li>)}</ul> : null}
          </section>
        );
      })}
    </article>
  );
}

/** "7. Anulare, modificare și rambursare" → "anulare-modificare-si-rambursare" */
function slug(h: string) {
  return h
    .replace(/^\d+\.\s*/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Turns URLs, www. hosts and email addresses in the copy into links. */
function linkify(text: string): ReactNode[] {
  return text.split(/(https?:\/\/[^\s,;]+|www\.[^\s,;]+[a-z]|[\w.+-]+@[\w-]+\.[\w.]+[a-z])/g).map((part, i) => {
    if (i % 2 === 0) return part;
    const href = part.includes("@") ? `mailto:${part}` : part.startsWith("http") ? part : `https://${part}`;
    return <a key={i} href={href} {...(part.includes("@") ? {} : { target: "_blank", rel: "noopener" })}>{part}</a>;
  });
}
