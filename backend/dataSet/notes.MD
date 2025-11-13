Downloaded BC OpenStreetMaps (OSM) data from BBBicles (using openmaptiles-tools) as it has slices of the data from OSM
- Planet data is ~80-90GB compressed no need for this for our MVP project
- For the future we downloaded the changes and merge with existing data
I also downloaded just Vancouver since it was much faster and smaller but ended up not using it

Used [Osmosis](https://osmcode.org/) to process the data to just get restaurants
- Used WSL as pre-built binaries for windows were only on conda
 - Specifically used osmium tags-filter --output=restaurantsInBC.osm.pbf -v --progress british-columbia-251111-raw.osm.pbf /amenity=restaurant

Used osmosis show filename to check it was indeed restaurants
- Further checked validity by filtering for a specific name or brand
- I tried viewing the map by using [openstreetmap-tile-server](https://github.com/Overv/openstreetmap-tile-server) but after running the docker a few times succesfully I never got anything but a blank map showing
- I also installed QGIS to try and view it but it didn't support pbf and after converting it so a sqlite database it wouldn't import so the other verification method is sufficient
