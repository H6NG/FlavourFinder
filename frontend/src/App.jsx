
import NavBar from "./component/navbar";
import React, { useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css'; 


export default function App() {


  useEffect(() => {
    // 1. Create the Map instance
    const map = new Map({
      // 2. Target the specific <div> using its ID
      target: 'demoMap', 
      
      // 3. Define the layers to show (e.g., OpenStreetMap)
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      
      // 4. Set the initial view (center and zoom)
      view: new View({
        center: [0, 0], // Coordinates for the center of the map
        zoom: 2, // Initial zoom level
      }),
    });

    // 5. Cleanup Function: This runs when the component is removed from the DOM
    // It is essential for preventing memory leaks when using third-party libraries.
    return () => {
      map.setTarget(undefined);
    };

  // The empty dependency array [] ensures this effect runs ONLY once on mount
  }, []); 

  // --- JSX Rendering ---
  return (
    <div className = "flex-container">


      <NavBar />
      
      <div style={{ padding: '20px' }}>
        <h2>📍 Global Map Viewer</h2>
        
        {/* This is the div where the map will be rendered */}
        <div 
          id="demoMap" 
          style={{ 

            height: '400px', 
            width: '800px', 
            border: '1px solid #333' 
          }}
        />
        
        <p style={{ marginTop: '20px' }}>
          Map functionality is active above. Click a navigation link to test the sign-in prompt.
        </p>
      </div>
    </div>

  );
}