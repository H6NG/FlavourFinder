// Find.jsx — Map + Floating Restaurant Picker + API Fix
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getUserLocation } from "./utility/getUserLocation.js";
import { getCookie } from "./utility/cookies.js";

const UBC_LAT = 49.2606;
const UBC_LON = -123.2460;

export default function FindPage({ trigger }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [message, setMessage] = useState("");

  // ============================================================
  // LOAD MAP + BACKEND API
  // ============================================================
  useEffect(() => {
    if (!mapRef.current) return;

    async function loadMap() {
      let lat = UBC_LAT;
      let lon = UBC_LON;

      // 1) TRY GPS
      try {
        const pos = await getUserLocation();
        lat = pos.lat;
        lon = pos.lon;
        console.log("GPS:", lat, lon);
      } catch {
        console.warn("GPS failed, using UBC fallback");
      }

      // 2) INIT MAP IF NOT CREATED
      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, { zoomControl: false });
      }

      // CENTER MAP
      mapInstance.current.setView([lat, lon], 15);

      // REMOVE ALL EXISTING TILE LAYERS BEFORE ADDING NEW ONE
      mapInstance.current.eachLayer((layer) => {
        if (!(layer instanceof L.Marker)) mapInstance.current.removeLayer(layer);
      });

      // ADD TILE LAYER
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(mapInstance.current);

      // USER LOCATION MARKER
      L.marker([lat, lon]).addTo(mapInstance.current).bindPopup("You are here");

      // 3) CALL BACKEND API FOR RECOMMENDATIONS
      const apiUrl =
        `https://javabackend.bungalou.ca/api/v1/rank/choice?latitude=${lat}&longitude=${lon}`;

      console.log("Calling API:", apiUrl);

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log("API RESULT:", data);

        // ----- IMPORTANT -----
        // Parse EXACT backend format
        const list = [
          data.restaurauntA,
          data.restaurauntB,
          data.restaurauntC,
        ].filter((x) => x && x.location);

        console.log("Parsed restaurants:", list);

        setRestaurants(list);
        setSelectedIndex(null);
        setMessage("");

        // ADD MARKERS FOR RESTAURANTS
        list.forEach((r) => {
          const { latitude, longitude } = r.location;

          if (!latitude || !longitude) return;

          L.marker([latitude, longitude])
            .addTo(mapInstance.current)
            .bindPopup(`<b>${r.name}</b>`);
        });

      } catch (error) {
        console.error("API fetch failed:", error);
        setRestaurants([]);
      }
    }

    loadMap();
  }, [trigger]);

  // ============================================================
  // SAVE CHOSEN RESTAURANT
  // ============================================================
  async function submitChoice() {
    if (selectedIndex === null) {
      alert("Please select a restaurant");
      return;
    }

    const chosen = restaurants[selectedIndex];
    const accessToken = getCookie("accessToken");

    const res = await fetch(
      "https://c2tp-backend-python.onrender.com/api/addHistory",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          restaurantId: chosen.name.replace(/\s+/g, "-"),
          restaurantName: chosen.name,
          location: chosen.location,
          rating: null,
          notes: "",
        }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      setMessage("Saved to history!");
    } else {
      setMessage("Failed: " + (data.error || "Unknown error"));
    }
  }

  // ============================================================
  // RENDER (MAP + FLOATING PICKER)
  // ============================================================
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>

      {/* MAP */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* FLOATING BOX ON TOP OF MAP */}
      {restaurants.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "420px",
            background: "white",
            padding: "18px",
            borderRadius: "14px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
            zIndex: 2000,     // <<< MAKE BOX ABOVE MAP
          }}
        >

          <h3 style={{ marginTop: 0 }}>Choose a Restaurant</h3>

          {restaurants.map((r, i) => (
            <label
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              <input
                type="radio"
                name="restaurantChoice"
                checked={selectedIndex === i}
                onChange={() => setSelectedIndex(i)}
                style={{ marginRight: "10px" }}
              />
              {r.name}
            </label>
          ))}

          <button
            onClick={submitChoice}
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "12px",
              background: "#2563eb",
              color: "white",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Save to History
          </button>

          {message && (
            <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
          )}
        </div>
      )}
    </div>
  );
}
