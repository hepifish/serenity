import NotFoundView from "@/components/NotFoundView";
import { apartmentFontVars, circumflex, cormorant, dmSans } from "./fonts";
import "./globals.css";

// The site's only 404. The root layout is the dynamic [lang] segment, so a
// not-found.tsx inside it cannot render on the server; this file can.
// Next 16 serves it for every URL no route matches, with a 404 status.

export default function GlobalNotFound() {
  return (
    <html data-scroll-behavior="smooth" lang="en" className={`${circumflex.variable} ${cormorant.variable} ${dmSans.variable} ${apartmentFontVars}`} suppressHydrationWarning>
      <body>
        <NotFoundView />
      </body>
    </html>
  );
}
