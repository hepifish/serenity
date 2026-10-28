import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { apartmentFontVars, circumflex, cormorant, dmSans } from "../fonts";
import { LOCALES, isLocale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import "../globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Serenity Apartments",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0e0b10", colorScheme: "dark" };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html data-scroll-behavior="smooth" lang={lang} className={`${circumflex.variable} ${cormorant.variable} ${dmSans.variable} ${apartmentFontVars}`} suppressHydrationWarning>
      <head>
        {/* lets CSS hide reveal-animated content only when JS will reveal it */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
