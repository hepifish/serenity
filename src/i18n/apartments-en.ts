import type { ApartmentCopy, ApartmentSlug } from "@/lib/apartments";

// The words for each apartment. Facts (guests, size, photos) live in
// src/lib/apartments.ts; ro and de mirror this file.
const copy: Record<ApartmentSlug, ApartmentCopy> = {
  "film-studio": {
    tagline: "A love letter to cinema",
    intro: "Fall asleep under The Godfather, wake to light through green velvet curtains.",
    story: [
      "A private screening room you get to live in. Film posters on every wall, a vintage Aspectomat projector on the shelf, a yellow sofa that dares you to stay in all day.",
      "The black accent wall turns the bedroom into a small dark cinema. The kitchen is yellow and bright, with a Nespresso machine for the morning after a late film. A desk by the window if the trip is half work.",
    ],
    highlights: [
      "Up to 4 guests · queen bed + sofa bed",
      "45 m², ground floor, private entrance",
      "Cinema poster collection",
      "Vintage Aspectomat slide projector",
      "Kitchen with Nespresso",
      "Workspace and fast Wi-Fi",
      "Private bathroom",
      "Terrace",
    ],
    alts: [
      "Yellow sofa beneath the cinema poster wall",
    ],
  },
  "gothic-chambers": {
    tagline: "Under stone vaults",
    intro: "Step through an arch into another century: vaulted ceilings, iron chandeliers, Tiffany light.",
    story: [
      "The building is from the 19th century and served as a hospital during the Second World War. In this apartment its bones show most: real vaulted ceilings, thick stone walls, a tall arched window.",
      "We furnished it the way the room asked for. A wrought-iron chandelier over the bed, stained-glass Tiffany lamps, peacock feathers, Dracula and Dumas on the shelf. Dark, warm and very quiet.",
    ],
    highlights: [
      "Up to 4 guests · queen bed + sofa bed",
      "45 m², ground floor, private entrance",
      "Original 19th-century vaulted ceilings",
      "Wrought-iron chandelier and lanterns",
      "Tiffany stained-glass lamps",
      "Kitchen with coffee machine",
      "Walk-in shower in dark stone",
      "Fast Wi-Fi",
    ],
    alts: [
      "Gothic Chambers living area under the vaulted ceiling",
    ],
  },
  "art-station": {
    tagline: "A small private gallery",
    intro: "Van Gogh, Kandinsky, Matisse, Rousseau on the walls. A red sofa in the middle of it all.",
    story: [
      "Museum prints of the masters line the walls: van Gogh, Kandinsky, Matisse, Rysselberghe, Rousseau, Bosch. The red sofa holds the room together, and a sculptural wire chandelier hangs above the round dining table.",
      "The bedroom is softer, under a woven wicker pendant, with a desk and an Edison lamp for writing postcards or emails. The Pop Art books on the console are there to be read.",
    ],
    highlights: [
      "Up to 4 guests · queen bed + sofa bed",
      "45 m², ground floor, private entrance",
      "Gallery wall of museum prints",
      "Red statement sofa, wire chandelier",
      "Workspace with Edison lamp",
      "Kitchen and round dining table",
      "Bathroom with walk-in shower",
      "Terrace",
    ],
    alts: [
      "Art Station living area with its wall of museum prints",
      "Rysselberghe and Rousseau prints above the red sofa",
      "Red sofa and round dining table",
      "Bedroom with the desk by the window",
      "Bed under the woven wicker pendant",
      "Workspace lit by an Edison lamp",
      "Candle and prints on the console",
    ],
  },
  "pink-panther": {
    tagline: "The fourth story",
    intro: "Our newest apartment, styled after a certain pink cat. Photos and online booking are on their way.",
    story: [
      "Pink Panther is the fourth Serenity apartment in Sibiu. It is being photographed now, and online booking opens here soon.",
      "Want to be the first to stay? Write to us with your dates and we'll tell you if it's free.",
    ],
    highlights: [],
    alts: [],
  },
};

export default copy;
