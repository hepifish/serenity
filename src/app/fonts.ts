import { Bodoni_Moda, Cinzel, Cormorant_Garamond, DM_Sans, Italiana, Jost } from "next/font/google";

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

// One display face per apartment, chosen from what is in the room.

/** Film Studio: the serif of classic film title cards. */
export const filmFont = Bodoni_Moda({ variable: "--font-film-studio", subsets: ["latin", "latin-ext"], style: ["normal", "italic"] });
/** Gothic Chambers: letters cut in stone, like the vaults. */
export const gothicFont = Cinzel({ variable: "--font-gothic-chambers", subsets: ["latin", "latin-ext"] });
/** Art Station: mid-century geometry, the Futura of museum posters. */
export const artFont = Jost({ variable: "--font-art-station", subsets: ["latin", "latin-ext"] });
/** Pink Panther: sixties Art Deco. */
export const pinkFont = Italiana({ variable: "--font-pink-panther", subsets: ["latin"], weight: "400" });

export const apartmentFontVars = [filmFont, gothicFont, artFont, pinkFont].map((f) => f.variable).join(" ");
