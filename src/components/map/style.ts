import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";

/*
  Sibiu at night, drawn from OpenStreetMap (OpenFreeMap vector tiles, no key).
  An ink drawing, not a street plan: the river in slate, green as one faint
  olive, a few road hairlines for structure and the old town as a quiet
  shape. No words: the only text on the map is our pins and landmarks.
  Small streets and houses appear only when someone zooms in close.
*/
const C = {
  ground: "#130f16",
  green: "#171b15",
  water: "#1c2c38",
  oldTown: "#3a2e40",
  building: "#1d1722",
  arterial: "#3a2f3d",
  local: "#272029",
  street: "#211b25",
  rail: "#241d28",
  runway: "#1b1620",
};

/** features whose OpenMapTiles `class` is one of these */
const cls = (classes: string[]): ExpressionSpecification => ["match", ["get", "class"], classes, true, false];
const width = (stops: [number, number][]): ExpressionSpecification => ["interpolate", ["exponential", 1.6], ["zoom"], ...stops.flat()];
const fadeIn = (from: number, to: number, max: number): ExpressionSpecification => ["interpolate", ["linear"], ["zoom"], from, 0, to, max];

/**
 * The historic centre, upper and lower town inside the old walls, traced by
 * hand from OpenStreetMap (it has no polygon of its own). Its lanes are drawn
 * at every zoom, so the old town reads as one fine, dense mesh in a city of
 * hairlines. (`within` tests lines, not polygons, so lanes, not roofs.)
 */
const OLD_TOWN: { type: "Polygon"; coordinates: number[][][] } = {
  type: "Polygon",
  coordinates: [
    [
      [24.1478, 45.7929],
      [24.1531, 45.7929],
      [24.1563, 45.7948],
      [24.1578, 45.7984],
      [24.1568, 45.8014],
      [24.1528, 45.8029],
      [24.148, 45.802],
      [24.1446, 45.7991],
      [24.1441, 45.796],
      [24.1478, 45.7929],
    ],
  ],
};
const inOldTown: ExpressionSpecification = ["within", OLD_TOWN];

/** a transportation line; drawn from `minzoom`, fading in over half a zoom level */
const line = (id: string, filter: ExpressionSpecification, color: string, w: [number, number][], minzoom = 0) => ({
  id,
  type: "line" as const,
  source: "omt",
  "source-layer": "transportation",
  minzoom,
  filter,
  layout: { "line-cap": "round" as const, "line-join": "round" as const },
  paint: { "line-color": color, "line-width": width(w), ...(minzoom ? { "line-opacity": fadeIn(minzoom, minzoom + 0.5, 1) } : {}) },
});

export const mapStyle: StyleSpecification = {
  version: 8,
  sources: { omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" } },
  layers: [
    { id: "ground", type: "background", paint: { "background-color": C.ground } },
    { id: "wood", type: "fill", source: "omt", "source-layer": "landcover", filter: cls(["wood", "forest"]), paint: { "fill-color": C.green } },
    { id: "park", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": C.green } },
    { id: "water", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": C.water } },
    // the Cibin, the one clear feature
    { id: "river", type: "line", source: "omt", "source-layer": "waterway", filter: cls(["river", "canal"]), paint: { "line-color": C.water, "line-width": width([[11, 1.6], [14, 3.2], [17, 9]]) } },
    { id: "runway", type: "line", source: "omt", "source-layer": "aeroway", filter: cls(["runway"]), paint: { "line-color": C.runway, "line-width": width([[11, 2], [17, 30]]) } },
    {
      id: "houses",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 16,
      paint: { "fill-color": C.building, "fill-opacity": fadeIn(16, 17, 0.6) },
    },
    // one faint rail line: the main tracks only, no yards or sidings
    line("rail", ["all", cls(["rail"]), ["!", ["has", "service"]]], C.rail, [[12, 0.5], [17, 1.5]], 12),
    // small streets wait for a close zoom, except inside the old walls
    line("streets", cls(["minor", "service"]), C.street, [[15.5, 0.5], [17, 3]], 15.5),
    line("old-town", ["all", cls(["minor", "service", "path"]), inOldTown], C.oldTown, [[12, 0.5], [14, 0.9], [17, 3]], 12),
    line("local", cls(["secondary", "tertiary"]), C.local, [[11, 0.4], [14, 0.9], [17, 5]]),
    line("arterial", cls(["primary", "trunk", "motorway"]), C.arterial, [[10, 0.5], [14, 1.3], [17, 7]]),
  ],
};
