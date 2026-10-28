import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { apartmentList } from "@/lib/apartments";
import { COMPANY } from "@/lib/site";
import PayLogos from "./PayLogos";

export default function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <p className="logo" style={{ color: "var(--bone)", marginBottom: "1rem" }}>Serenity<span>.</span></p>
            <p style={{ maxWidth: "22rem" }}>{t.footer.tagline}</p>
            <p style={{ marginTop: "1rem" }}><a className="link" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></p>
          </div>
          <div>
            <h2>{t.nav.apartments}</h2>
            <ul>
              {apartmentList().map((a) => (
                <li key={a.slug}><Link href={`/${lang}/apartments/${a.slug}`}>{a.name}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{t.footer.legal}</h2>
            <ul>
              <li><Link href={`/${lang}/terms`}>{t.footer.terms}</Link></li>
              <li><Link href={`/${lang}/privacy`}>{t.footer.privacy}</Link></li>
              <li><a href="https://anpc.ro" target="_blank" rel="noopener">ANPC</a></li>
              <li><a href="https://reclamatiisal.anpc.ro" target="_blank" rel="noopener">{t.footer.anpc} · SAL</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {COMPANY.name} · CUI {COMPANY.cui} · {COMPANY.regCom} · {COMPANY.address}
          </p>
          <PayLogos label={t.footer.payments} />
        </div>
      </div>
    </footer>
  );
}
