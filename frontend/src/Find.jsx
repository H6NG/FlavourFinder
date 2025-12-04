// Find.jsx — Leaflet map inside this file
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// UBC location
const UBC_LAT = 49.2606;
const UBC_LON = -123.2460;

// This small internal component recenters the map when Find is clicked
function RecenterOnFind({ trigger }) {
  const map = useMap();

  useEffect(() => {
    if (trigger > 0) {
      console.log("Re-centering map to UBC…");
      map.setView([UBC_LAT, UBC_LON], 15);
    }
  }, [trigger]);

  return null;
}

export default function Find({ trigger }) {
  return (
    <MapContainer
      center={[UBC_LAT, UBC_LON]}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* Recenter when user clicks Find */}
      <RecenterOnFind trigger={trigger} />
    </MapContainer>
  );
}
