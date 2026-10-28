import { Bodoni_Moda, Cinzel, Cormorant_Garamond, DM_Sans, Jost, Ribeye } from "next/font/google";
import localFont from "next/font/local";

// Declared once and shared by the site and the admin layouts.
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

/**
 * Cormorant's lowercase â and î carry a tall spike that reads as broken in
 * Romanian headlines. These files are Cormorant itself (OFL) with only those two
 * letters redrawn using the font's own capital circumflex, ~1 KB per style,
 * fetched only on pages that contain them. Rebuild: scripts/fonts/patch-circumflex.py.
 */
export const circumflex = localFont({
  variable: "--font-circumflex",
  // next/font needs literals here
  src: [
    { path: "./fonts/circumflex-300.woff2", weight: "300", style: "normal" },
    { path: "./fonts/circumflex-300-italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/circumflex-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/circumflex-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/circumflex-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/circumflex-500-italic.woff2", weight: "500", style: "italic" },
  ],
  declarations: [{ prop: "unicode-range", value: "U+00E2, U+00EE" }],
  preload: false,
  fallback: [],
  adjustFontFallback: false,
});

// Both are variable fonts: one file covers every weight we use.
export const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

// One display face per apartment, chosen from what is in the room.

/** Film Studio: the serif of classic film title cards. */
export const filmFont = Bodoni_Moda({ variable: "--font-film-studio", subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });
/** Gothic Chambers: letters cut in stone, like the vaults. */
export const gothicFont = Cinzel({ variable: "--font-gothic-chambers", subsets: ["latin", "latin-ext"] });
/** Art Station: mid-century geometry, the Futura of museum posters. */
export const artFont = Jost({ variable: "--font-art-station", subsets: ["latin", "latin-ext"] });
/** Pink Panther: flared, hand-cut capitals on a bouncing baseline, in the spirit of the films (not their trademarked logo). */
export const pinkFont = Ribeye({ variable: "--font-pink-panther", subsets: ["latin"], weight: "400" });

export const apartmentFontVars = [filmFont, gothicFont, artFont, pinkFont].map((f) => f.variable).join(" ");
