// App.jsx — FINAL LEAFLET VERSION
import React, { useState } from "react";

import "./App.css";

import NavBar from "./component/navbar";
import SettingsPage from "./Settings";
import HistoryPage from "./getHistory";
import RatePage from "./Rate";
import FeedPage from "./Feed";
import Find from "./Find"; // <--- Leaflet map inside Find.jsx

export default function App() {
  const [currentPage, setCurrentPage] = useState("map");
  const [findTrigger, setFindTrigger] = useState(0); 

  return (
    <>
      <NavBar
        onFind={() => {
          setCurrentPage("map");
          setFindTrigger((n) => n + 1); // triggers recenter in Find.jsx
        }}
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

      {/* MAP PAGE — Leaflet */}
      {currentPage === "map" && (
        <div className="map-content" style={{ height: "100%", width: "100%" }}>
          <Find trigger={findTrigger} />
        </div>
      )}
    </>
  );
}
