import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "../globals.css";
import "./admin.css";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "latin-ext"], weight: ["300", "400"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin", "latin-ext"], weight: ["300", "400", "500"] });

export const metadata: Metadata = { title: "Serenity · Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="admin">{children}</body>
    </html>
  );
}
