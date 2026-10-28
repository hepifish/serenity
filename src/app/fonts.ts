import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// Declared once and shared by the site and the admin layouts.
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

// Both are variable fonts: one file covers every weight we use.
export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});
