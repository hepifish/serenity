import type { Metadata } from "next";
import { cormorant, dmSans } from "../fonts";
import "../globals.css";
import "./admin.css";


export const metadata: Metadata = { title: "Serenity · Admin", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="admin">{children}</body>
    </html>
  );
}
