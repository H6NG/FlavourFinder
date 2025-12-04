// Find.jsx — Leaflet map using real GPS (fallback → UBC)
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getUserLocation } from "./utility/getUserLocation.js";

// Default fallback location
const UBC_LAT = 49.2606;
const UBC_LON = -123.2460;

export default function FindPage() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return; // Prevent multiple maps

    async function createMap() {
      let lat = UBC_LAT;
      let lon = UBC_LON;

      // --------------------------
      // Try real user GPS location
      // --------------------------
      try {
        console.log("Requesting GPS...");
        const pos = await getUserLocation();
        lat = pos.lat;
        lon = pos.lon;
        console.log("GPS SUCCESS →", lat, lon);
      } catch (err) {
        console.warn("GPS FAILED → USING UBC:", err);
      }

      // --------------------------
      // Initialize Leaflet map
      // --------------------------
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false, // remove +/-
      }).setView([lat, lon], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "",
      }).addTo(mapInstance.current);

      // Marker on location
      L.marker([lat, lon])
        .addTo(mapInstance.current)
        .bindPopup(lat === UBC_LAT ? "UBC (Fallback)" : "You are here")
        .openPopup();
    }

    createMap();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
