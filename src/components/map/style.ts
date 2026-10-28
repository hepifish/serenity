import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";

/*
  Sibiu at night, drawn from OpenStreetMap (OpenFreeMap vector tiles, no key).
  Only what helps you find the door: water, green, streets, the roofs of the
  old town and a few quiet names. Colours follow globals.css: aubergine
  black ground, bone hairlines, olive for green, a slate river.
*/
const C = {
  ground: "#130f16",
  green: "#1a1e17",
  wood: "#181d16",
  water: "#15202a",
  building: "#1f1824",
  buildingEdge: "#2b2231",
  minor: "#2a2230",
  major: "#3d3140",
  arterial: "#544249",
  rail: "#3a3040",
  runway: "#221b27",
  label: "#857c72",
  labelQuiet: "#5f5750",
  halo: "#130f16",
};

const name: ExpressionSpecification = ["coalesce", ["get", "name:latin"], ["get", "name"]];
/** features whose OpenMapTiles `class` is one of these */
const cls = (classes: string[]): ExpressionSpecification => ["match", ["get", "class"], classes, true, false];
const width = (stops: [number, number][]): ExpressionSpecification => ["interpolate", ["exponential", 1.6], ["zoom"], ...stops.flat()];

export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: { omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" } },
  layers: [
    { id: "ground", type: "background", paint: { "background-color": C.ground } },
    { id: "wood", type: "fill", source: "omt", "source-layer": "landcover", filter: cls(["wood", "forest"]), paint: { "fill-color": C.wood } },
    { id: "green", type: "fill", source: "omt", "source-layer": "landcover", filter: cls(["grass", "farmland", "meadow"]), paint: { "fill-color": C.green, "fill-opacity": 0.7 } },
    { id: "park", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": C.green } },
    { id: "water", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": C.water } },
    { id: "waterway", type: "line", source: "omt", "source-layer": "waterway", paint: { "line-color": C.water, "line-width": width([[12, 1], [17, 4]]) } },
    { id: "runway", type: "line", source: "omt", "source-layer": "aeroway", filter: cls(["runway"]), paint: { "line-color": C.runway, "line-width": width([[11, 3], [17, 40]]) } },
    {
      id: "building",
      type: "fill",
      source: "omt",
      "source-layer": "building",
      minzoom: 13,
      paint: { "fill-color": C.building, "fill-outline-color": C.buildingEdge, "fill-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0, 14.5, 1] },
    },
    {
      id: "minor",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: cls(["minor", "service"]),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": C.minor, "line-width": width([[12, 0.4], [14, 1], [17, 6]]) },
    },
    {
      id: "major",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: cls(["secondary", "tertiary"]),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": C.major, "line-width": width([[11, 0.6], [14, 1.6], [17, 9]]) },
    },
    {
      id: "arterial",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: cls(["primary", "trunk", "motorway"]),
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": C.arterial, "line-width": width([[10, 0.8], [14, 2.2], [17, 11]]) },
    },
    {
      id: "rail",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      filter: cls(["rail"]),
      paint: { "line-color": C.rail, "line-width": 1, "line-dasharray": [3, 3] },
    },
    {
      id: "street-names",
      type: "symbol",
      source: "omt",
      "source-layer": "transportation_name",
      minzoom: 14,
      filter: cls(["primary", "secondary", "tertiary"]),
      layout: {
        "symbol-placement": "line",
        "text-field": name,
        "text-font": ["Noto Sans Regular"],
        "text-size": 10,
        "text-letter-spacing": 0.08,
      },
      paint: { "text-color": C.labelQuiet, "text-halo-color": C.halo, "text-halo-width": 1.4 },
    },
    {
      id: "river-names",
      type: "symbol",
      source: "omt",
      "source-layer": "water_name",
      layout: { "symbol-placement": "line", "text-field": name, "text-font": ["Noto Sans Italic"], "text-size": 11, "text-letter-spacing": 0.2 },
      paint: { "text-color": "#4f6470", "text-halo-color": C.halo, "text-halo-width": 1 },
    },
    {
      id: "districts",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      // the old town and its upper town are named by the Piața Mare landmark instead
      filter: ["all", cls(["suburb", "quarter", "neighbourhood"]), ["!", ["in", ["get", "name"], ["literal", ["Centrul Istoric", "Orașul de Sus"]]]]],
      layout: {
        "text-field": ["upcase", name],
        "text-font": ["Noto Sans Regular"],
        "text-size": 9.5,
        "text-letter-spacing": 0.3,
        "text-max-width": 8,
      },
      paint: { "text-color": C.labelQuiet, "text-halo-color": C.halo, "text-halo-width": 1.4 },
    },
  ],
};
