// Find.jsx
import { detectDeviceType } from "./utility/detectDevice.js";
import { getUserLocation } from "./utility/getUserLocation.js";
import { getCookie, setCookie } from "./utility/cookies.js";

export default function useFind(mapInstanceRef, viewRef) {

  // This function is returned to App.jsx
  const runFind = async () => {
    try {
      console.log("DEVICE =", detectDeviceType());

      // -----------------------------
      // 1. Try using cached location
      // -----------------------------
      let lat = getCookie("latitude");
      let lon = getCookie("longitude");

      if (!lat || !lon) {
        console.log("Cookies missing → requesting GPS...");
        const pos = await getUserLocation();

        lat = pos.lat;
        lon = pos.lon;

        // Save location to cookie for 60 min
        setCookie("latitude", lat, 60);
        setCookie("longitude", lon, 60);

        console.log("Saved GPS → cookies:", lat, lon);
      } else {
        console.log("Using cookie location:", lat, lon);
        lat = parseFloat(lat);
        lon = parseFloat(lon);
      }

      // -----------------------------
      // 2. Move map to user location
      // -----------------------------
      if (viewRef.current) {
        viewRef.current.animate({
          center: [lon, lat].map((c, i) => 
            i === 0 ? c * (Math.PI/180)*6378137 : c * (Math.PI/180)*6378137
          ),
          zoom: 14,
          duration: 1000,
        });
      }

      // -----------------------------
      // 3. Ensure map resizes properly
      // -----------------------------
      setTimeout(() => {
        mapInstanceRef.current?.updateSize();
      }, 200);

    } catch (err) {
      console.error("FIND ERROR", err);
      alert("Unable to retrieve location.");
    }
  };

  return runFind;
}
