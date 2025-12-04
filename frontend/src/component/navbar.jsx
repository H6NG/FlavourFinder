import React from "react";
import "./navbar.css";
import { Home, Layers, Star, History, Settings } from "lucide-react";

export default function Sidebar({ onFind, onSettings, onCompare, onHistory, onRate }) {
  return (
    <div className="sidebar">
      <h2 className="logo">FlavourFinder</h2>

      <ul className="nav-links">
        <li><a onClick={onFind}><Home /> Find</a></li>
        <li><a onClick={onCompare}><Layers /> Compare</a></li>
        <li><a onClick={onRate}><Star /> Rate</a></li>
        <li><a onClick={onHistory}><History /> History</a></li>
        <li><a onClick={onSettings}><Settings /> Settings</a></li>
      </ul>
    </div>
  );
}

