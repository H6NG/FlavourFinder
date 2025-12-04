import NavBar from "./component/navbar";
import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import "./App.css";

import { detectDeviceType } from "./detectDevice";
import { getUserLocation } from "./getUserLocation";

export default function App() {
  const mapRef = useRef();
  const viewRef = useRef(null);

  const [choiceData, setChoiceData] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    const view = new View({
      center: fromLonLat([0, 0]),
      zoom: 2,
    });
    viewRef.current = view;

    const map = new Map({
      target: mapRef.current,
      layers: [new TileLayer({ source: new OSM() })],
      view: view
    });

    return () => map.setTarget(undefined);
  }, []);

  // 🔥 This runs when the user presses FIND
  const handleFind = async () => {
    const device = detectDeviceType();
    console.log("DEVICE:", device);

    try {
      const { lat, lon } = await getUserLocation();
      console.log("LOCATION:", lat, lon);

      // zoom map to user
      viewRef.current.animate({
        center: fromLonLat([lon, lat]),
        zoom: 13,
        duration: 1500,
      });

      // 1️⃣ Call your random restaurant endpoint
      const res = await fetch("http://javabackend.bungalou.ca/api/v1/rank/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });

      const data = await res.json();

      // 2️⃣ Store Restaurant A/B/C
      setChoiceData(data);

    } catch (err) {
      alert("Unable to get location. Please enable GPS");
    }
  };

  // 🔥 This is when user chooses a restaurant
  const chooseRestaurant = (choice) => {
    console.log("User selected:", choice);

    // You will later:
    // POST /api/makeChoice
    // store history
    // navigate to next screen
  };

  return (
    <>
      <NavBar onFind={handleFind} />

      <div className="map-content">
        <div
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {choiceData && (
        <div className="choice-container">
          <h3>Choose your restaurant</h3>

          <button onClick={() => chooseRestaurant("A")}>
            {choiceData.restaurantA.name}
          </button>

          <button onClick={() => chooseRestaurant("B")}>
            {choiceData.restaurantB.name}
          </button>

          <button onClick={() => chooseRestaurant("C")}>
            {choiceData.restaurantC.name}
          </button>
        </div>
      )}
    </>
  );
}
