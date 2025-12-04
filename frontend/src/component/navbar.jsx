import React from "react";
import "./navbar.css";
import { Home, Layers, Star, History, Settings } from "lucide-react";

export default function Sidebar({ onFind }) {
  return (
    <div className="sidebar">
      <h2 className="logo">FlavourFinder</h2>

      <ul className="nav-links">
        <li><a onClick={onFind}><Home /> Find</a></li>
        <li><a><Layers /> Compare</a></li>
        <li><a ><Star /> Rate</a></li>
        <li><a><History /> History</a></li>
        <li><a><Settings /> Settings</a></li>
      </ul>
    </div>
  );
}

