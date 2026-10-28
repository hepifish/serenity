"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LOCALES, LOCALE_NAME, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

/** Swaps the language prefix and keeps the visitor on the same page. */
function switchHref(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  parts[1] = to;
  return parts.join("/") || `/${to}`;
}

export default function Header({ lang, t, solid = false }: { lang: Locale; t: Dict["nav"]; solid?: boolean }) {
  const pathname = usePathname() ?? `/${lang}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const links = [
    { href: `/${lang}#apartments`, label: t.apartments },
    { href: `/${lang}#sibiu`, label: t.sibiu },
    { href: `/${lang}#faq`, label: t.faq },
    { href: `/${lang}#contact`, label: t.contact },
  ];

  // "Book direct" opens whichever date picker this page has; elsewhere it goes home and opens it there.
  function book(e: React.MouseEvent) {
    setOpen(false);
    if (window.dispatchEvent(new CustomEvent("serenity:pick-dates", { cancelable: true })) === false) e.preventDefault();
  }

  const langs = (
    <nav className="lang" aria-label={t.language}>
      {LOCALES.map((l) => (
        <Link key={l} href={switchHref(pathname, l)} hrefLang={l} lang={l} aria-current={l === lang} title={LOCALE_NAME[l]}>
          {l}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      <header className={`header ${scrolled || solid || open ? "solid" : ""}`}>
        <div className="wrap">
          <Link href={`/${lang}`} className="logo" aria-label="Serenity Apartments">
            Serenity<span>.</span>
          </Link>
          <nav aria-label="Main">
            <ul className="nav">
              {links.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="header-end">
            {langs}
            <Link href={`/${lang}?pick=1`} rel="nofollow" className="btn" onClick={book}>{t.book}</Link>
            <button type="button" className="burger" aria-expanded={open} aria-controls="drawer" aria-label={open ? t.close : t.menu} onClick={() => setOpen(!open)}>
              <span /><span />
            </button>
          </div>
        </div>
      </header>
      <div id="drawer" className={`drawer ${open ? "open" : ""}`} hidden={!open}>
        <ul>
          {links.map((l) => (
            <li key={l.href}><Link href={l.href} onClick={() => setOpen(false)}>{l.label}</Link></li>
          ))}
        </ul>
        {langs}
        <Link href={`/${lang}?pick=1`} rel="nofollow" className="btn block" onClick={book}>{t.book}</Link>
      </div>
    </>
  );
}
