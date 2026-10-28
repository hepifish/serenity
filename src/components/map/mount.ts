import { AttributionControl, LngLatBounds, Map, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapStyle } from "./style";

// MapLibre looks for its worker next to its own file, which a bundler moves;
// this hands the bundler the worker as an asset of its own.
setWorkerUrl(new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).href);

/*
  Loaded only when the map is about to scroll into view (see LocationMap):
  MapLibre is about 1.5 MB with its worker, so the first paint never pays for it.
*/

type Point = { lat: number; lng: number };

export type MountOptions = {
  container: HTMLElement;
  fit: Point[];
  locale: Record<string, string>;
  reducedMotion: boolean;
  onError: () => void;
};

/** Room for the pin cards, which stand above their points. */
function padding(el: HTMLElement) {
  const narrow = el.clientWidth < 600;
  return { top: narrow ? 150 : 170, bottom: narrow ? 56 : 72, left: narrow ? 96 : 140, right: narrow ? 96 : 140 };
}

export function mount({ container, fit, locale, reducedMotion, onError }: MountOptions) {
  const bounds = fit.reduce((b, p) => b.extend([p.lng, p.lat]), new LngLatBounds([fit[0].lng, fit[0].lat], [fit[0].lng, fit[0].lat]));
  const map = new Map({
    container,
    style: mapStyle,
    bounds,
    fitBoundsOptions: { padding: padding(container), maxZoom: 15.5 },
    minZoom: 10,
    maxZoom: 17.5,
    // a page scrolls past the map: one finger (or a plain wheel) keeps scrolling the page
    cooperativeGestures: true,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    attributionControl: false,
    fadeDuration: reducedMotion ? 0 : 300,
    locale,
  });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");
  map.addControl(new AttributionControl({ compact: false }), "bottom-left");
  // a tile that fails later is a hiccup; an error before the first full draw means no map
  let drawn = false;
  map.once("load", () => (drawn = true));
  map.on("error", () => {
    if (!drawn) onError();
  });

  // keep the framing when the frame changes size (rotation, resize)
  let width = container.clientWidth;
  const ro = new ResizeObserver(() => {
    if (container.clientWidth === width || container.clientWidth < 200) return;
    width = container.clientWidth;
    map.resize();
    map.fitBounds(bounds, { padding: padding(container), maxZoom: 15.5, animate: false });
  });
  ro.observe(container);

  return {
    map,
    addMarker(el: HTMLElement, p: Point) {
      return new Marker({ element: el, anchor: "center" }).setLngLat([p.lng, p.lat]).addTo(map);
    },
    remove() {
      ro.disconnect();
      map.remove();
    },
  };
}
