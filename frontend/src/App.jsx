import NavBar from "./component/navbar";
import React, { useEffect, useRef, useState } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import { fromLonLat } from "ol/proj";
import "ol/ol.css";
import "./App.css";

import SettingsPage from "./Settings.jsx";
import useFind from "./Find.jsx";

export default function App() {
  const mapRef = useRef();
  const mapInstanceRef = useRef(null);
  const viewRef = useRef(null);

  const [currentPage, setCurrentPage] = useState("map");

  // mount map
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

  // FIX map resize when switching page
  useEffect(() => {
    if (currentPage === "map") {
      setTimeout(() => {
        mapInstanceRef.current?.updateSize();
      }, 150);
    }
  }, [currentPage]);

  // Import Find logic
  const runFind = useFind(mapInstanceRef, viewRef);

  return (
    <>
      <NavBar
        onFind={() => {
          setCurrentPage("map");
          runFind();
        }}
        onSettings={() => setCurrentPage("settings")}
      />

      {currentPage === "settings" && (
        <div className="content-container">
          <SettingsPage />
        </div>
      )}

      {currentPage === "map" && (
        <div className="map-content">
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>
      )}
    </>
  );
}
