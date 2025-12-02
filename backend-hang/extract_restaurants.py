"""import osmium
import json

class RestaurantHandler(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.restaurants = []

    def node(self, n):
        if 'amenity' in n.tags and n.tags['amenity'] == 'restaurant':
            self.restaurants.append({
                "osm_id": n.id,
                "name": n.tags.get("name"),
                "lat": n.location.lat,
                "lon": n.location.lon,
                "cuisine": n.tags.get("cuisine")
            })

# Only parsing the PBF file
PBF_FILE = "restaurantsInBC.osm.pbf"

h = RestaurantHandler()
h.apply_file(PBF_FILE, locations=True)

print("Found:", len(h.restaurants))

with open("restaurants.json", "w") as f:
    json.dump(h.restaurants, f, indent=2)

print("Saved restaurants.json")
"""

import osmium
import json

class RestaurantHandler(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.restaurants = []

    def node(self, n):
        # Must have required tags
        if 'amenity' not in n.tags or n.tags['amenity'] != 'restaurant':
            return
        
        # Required fields
        osm_id = n.id
        name = n.tags.get("name")
        cuisine = n.tags.get("cuisine")
        
        # Required coordinates
        if not n.location.valid():
            return
        
        lat = n.location.lat
        lon = n.location.lon
        
        # FILTER: skip entries with missing values
        if osm_id is None or name is None or lat is None or lon is None:
            return
        
        # Finally add the clean restaurant
        self.restaurants.append({
            "osm_id": osm_id,
            "name": name,
            "lat": lat,
            "lon": lon,
            "cuisine": cuisine
        })

# Only parsing the PBF file
PBF_FILE = "restaurantsInBC.osm.pbf"

h = RestaurantHandler()
h.apply_file(PBF_FILE, locations=True)

print("Found valid restaurants:", len(h.restaurants))

with open("restaurants.json", "w") as f:
    json.dump(h.restaurants, f, indent=2)

print("Saved restaurants.json")
