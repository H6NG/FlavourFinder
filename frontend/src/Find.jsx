// Find.jsx — GPS → Backend → Leaflet Markers (FINAL VERSION)
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getUserLocation } from "./utility/getUserLocation.js";

const UBC_LAT = 49.2606;
const UBC_LON = -123.2460;

export default function FindPage({ trigger }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // Re-run FIND when trigger changes (when clicking Find)
  useEffect(() => {
    if (!mapRef.current) return;

    async function loadMap() {
      // ---------------------------------------------
      // 1) GET LOCATION (GPS → fallback to UBC)
      // ---------------------------------------------
      let lat = UBC_LAT;
      let lon = UBC_LON;

      try {
        const pos = await getUserLocation();
        lat = pos.lat;
        lon = pos.lon;
        console.log("GPS OK:", lat, lon);
      } catch (err) {
        console.warn("GPS FAILED → Using UBC:", err);
      }

      // ---------------------------------------------
      // 2) INITIALIZE OR RESET MAP
      // ---------------------------------------------
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, { zoomControl: false });
      }

      mapInstance.current.setView([lat, lon], 15);
      mapInstance.current.eachLayer((layer) => {
        if (layer instanceof L.Marker === false) mapInstance.current.removeLayer(layer);
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(mapInstance.current);

      // Mark user position
      L.marker([lat, lon])
        .addTo(mapInstance.current)
        .bindPopup("You are here");

      // ---------------------------------------------
      // 3) CALL BACKEND USING USER LOCATION
      // ---------------------------------------------
      const apiUrl =
        `https://javabackend.bungalou.ca/api/v1/rank/choice?latitude=${lat}&longitude=${lon}`;

      console.log("Calling API:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log("API RESULT:", data);

        // ---------------------------------------------
        // 4) Backend returns an OBJECT, not an array
        // ---------------------------------------------
        const restaurants = [
          data.restaurauntA,
          data.restaurauntB,
          data.restaurauntC,
        ].filter(Boolean); // remove null or undefined

        restaurants.forEach((rest) => {
          if (!rest.location) return;

          const { latitude, longitude } = rest.location;
          if (!latitude || !longitude) return;

          L.marker([latitude, longitude])
            .addTo(mapInstance.current)
            .bindPopup(`
              <b>${rest.name}</b><br>
              Lat: ${latitude}<br>
              Lon: ${longitude}
            `);
        });
      } catch (err) {
        console.error("API FETCH FAILED:", err);
      }
    }

    loadMap();
  }, [trigger]); // <--- RUN EVERY TIME user clicks Find

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
