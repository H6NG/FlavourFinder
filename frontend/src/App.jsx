// App.jsx
import React, { useEffect, useRef, useState } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

import "ol/ol.css";
import "./App.css";

import NavBar from "./component/navbar";
import SettingsPage from "./Settings.jsx";
import HistoryPage from "./getHistory.jsx";
import useFind from "./Find.jsx";

export default function App() {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const viewRef = useRef(null);

  // "map", "settings", or "history"
  const [currentPage, setCurrentPage] = useState("map");

  // -----------------------------------------
  // Mount the OpenLayers map ONCE
  // -----------------------------------------
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
      view,
    });

    mapInstanceRef.current = map;

    return () => map.setTarget(undefined);
  }, []);

  // Find functionality (GPS + cookies)
  const runFind = useFind(mapInstanceRef, viewRef);

  // -----------------------------------------
  // Always call runFind ONLY AFTER map is visible
  // -----------------------------------------
  useEffect(() => {
    if (currentPage === "map") {
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.updateSize();
          console.log("MAP SIZE BEFORE FIND =", mapInstanceRef.current.getSize());
        }
        runFind();
      }, 120);
    }
  }, [currentPage]);

  return (
    <>
      <NavBar
        onFind={() => setCurrentPage("map")}
        onHistory={() => setCurrentPage("history")}
        onSettings={() => setCurrentPage("settings")}
      />

      {/* HISTORY PAGE */}
      {currentPage === "history" && (
        <div className="content-container">
          <HistoryPage />
        </div>
      )}

      {/* SETTINGS PAGE */}
      {currentPage === "settings" && (
        <div className="content-container">
          <SettingsPage />
        </div>
      )}

      {/* MAP PAGE */}
      {currentPage === "map" && (
        <div className="map-content">
          <div
            ref={mapRef}
            style={{ width: "100%", height: "100%", position: "relative" }}
          />
        </div>
      )}
    </>
  );
}
