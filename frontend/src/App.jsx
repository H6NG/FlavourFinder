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
import RatePage from "./Rate.jsx";
import FeedPage from "./Feed.jsx";   // <-- Feed only
import useFind from "./Find.jsx";

export default function App() {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const viewRef = useRef(null);

  // pages: map, feed, rate, history, settings
  const [currentPage, setCurrentPage] = useState("map");

  // -----------------------------------------
  // Mount map
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

  const runFind = useFind(mapInstanceRef, viewRef);

  useEffect(() => {
    if (currentPage === "map") {
      setTimeout(() => {
        mapInstanceRef.current?.updateSize();
        runFind();
      }, 120);
    }
  }, [currentPage]);

  return (
    <>
      <NavBar
        onFind={() => setCurrentPage("map")}
        onFeed={() => setCurrentPage("feed")}
        onRate={() => setCurrentPage("rate")}
        onHistory={() => setCurrentPage("history")}
        onSettings={() => setCurrentPage("settings")}
      />

      {/* FEED PAGE */}
      {currentPage === "feed" && (
        <div className="content-container">
          <FeedPage />
        </div>
      )}

      {/* RATE PAGE */}
      {currentPage === "rate" && (
        <div className="content-container">
          <RatePage />
        </div>
      )}

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
