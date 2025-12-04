
import NavBar from "./component/navbar";
import React, { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css'; 
import './App.css';

import { fromLonLat } from 'ol/proj';

export default function App() {

  
  const mapElement = useRef();


  useEffect(() => {

    if (!mapElement.current) return;

    
    // We create the view outside of the map setup so we can update it later.
    const initialView = new View({
      center: fromLonLat([0, 0]), // Default center (in case geolocation fails)
      zoom: 2, 
    });

    // 1. Create the Map instance
    const map = new Map({
      // 2. Target the specific <div> using its ID
      target: mapElement.current, 
      
      // 3. Define the layers to show (e.g., OpenStreetMap)
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      
      // 4. Set the initial view (center and zoom)
      view: initialView,
    });


    // --- 3. Get User Location (Geolocation API) ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success callback
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;
          
          // Convert standard Lat/Lon to the projection OpenLayers uses (Web Mercator)
          const newCenter = fromLonLat([lon, lat]);

          // Update the map's view to the new location
          initialView.animate({
            center: newCenter,
            duration: 2000, // Smooth transition time in milliseconds
            zoom: 12,      // Zoom in closer to the local area
          });
        },
        (error) => {
          // Error callback (e.g., user denied permission)
          console.warn('Geolocation failed:', error);
          // The map will remain at the default center [0, 0]
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }

    // 5. Cleanup Function: This runs when the component is removed from the DOM
    // It is essential for preventing memory leaks when using third-party libraries.
    return () => {
      map.setTarget(undefined);
    };

  // The empty dependency array [] ensures this effect runs ONLY once on mount
  }, []); 

  // --- JSX Rendering ---
  return (
    <>

    <NavBar/>

    <div className="map-content">
      <div
        ref={mapElement} // Attach the ref here
            style={{
              width: "100%",  // Fill width of parent
              height: "100%", // Fill height of parent
            }} 
          />


    </div>
    
    </>
  );
}