// Find.jsx (TEST VERSION)
import { getUserLocation } from "./utility/getUserLocation.js";
import { getCookie, setCookie } from "./utility/cookies.js";

const UBC_LAT = 49.2606;
const UBC_LON = -123.2460;

export default function useFind(mapInstanceRef, viewRef) {
  const runFind = async () => {
    console.log("=== FIND START ===");

    try {
      let lat = getCookie("latitude");
      let lon = getCookie("longitude");

      console.log("COOKIE lat/lon =", lat, lon);

      // Parse cookie if exists
      if (lat && lon) {
        lat = Number(lat);
        lon = Number(lon);
        console.log("PARSED cookie lat/lon =", lat, lon);
      }

      // If cookie invalid or missing → try GPS
      if (!lat || !lon || Number.isNaN(lat) || Number.isNaN(lon)) {
        console.log("Cookie invalid → Requesting GPS…");

        try {
          const pos = await getUserLocation();
          lat = pos.lat;
          lon = pos.lon;

          console.log("GPS SUCCESS =", lat, lon);

          setCookie("latitude", lat, 60);
          setCookie("longitude", lon, 60);
        } catch (err) {
          console.log("GPS FAILED → Using UBC fallback");
          lat = UBC_LAT;
          lon = UBC_LON;
        }
      }

      console.log("FINAL lat/lon =", lat, lon);

      // Convert to WebMercator
      const toMercator = (deg) => deg * (Math.PI / 180) * 6378137;
      const center = [toMercator(lon), toMercator(lat)];

      console.log("CENTER COORDS (WebMercator) =", center);

      if (Number.isNaN(center[0]) || Number.isNaN(center[1])) {
        console.error("CENTER IS NaN → STOPPING");
        return;
      }

      // Move map
      if (viewRef.current) {
        console.log("Animating map view…");
        viewRef.current.animate({
          center,
          zoom: 14,
          duration: 1000,
        });
      } else {
        console.log("viewRef is NULL!");
      }

      // Force redraw
      setTimeout(() => {
        console.log("Updating map size + render");
        mapInstanceRef.current?.updateSize();
        mapInstanceRef.current?.render();
      }, 150);

    } catch (error) {
      console.error("FIND ERROR:", error);
    }

    console.log("=== FIND END ===");
  };

  return runFind;
}
