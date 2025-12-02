
import NavBar from "./component/navbar";
import React, { useEffect } from 'react';
/*
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css'; 
*/

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
    <>
    
    <div class="flex-column">
      <div class="column-item"><NavBar /></div>
      <div class="column-item">
           <div className="flex justify-center" style={{ padding: '20px' }}>
          
            {/*This is the div where the map will be rendered*/}
            <div
              id="demoMap"
              style={{
                height: '800px',
                width: '1080px',
                border: '1px solid #333'
              }} />
          </div>
        </div>
    </div>
    
    </>
  );
}