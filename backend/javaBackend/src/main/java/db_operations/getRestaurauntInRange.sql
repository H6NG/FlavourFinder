INSERT INTO restauraunt (resname, locatLat, locatLong) VALUES 
('London', 51.5073219, -0.1276474), 
('Edinburgh', 55.9533456, -3.1883749), 
('Paris', 48.8588897, 2.320041), 
('Amsterdam', 52.3727598, 4.8936041), 
('Washington', 38.8950368, -77.0365427), 
('Delhi', 28.6138954, 77.2090057), 
('Sydney', -33.8698439, 151.2082848), 
('Null Island', 0, 0), 
('North Pole', 90, 0), 
('South Pole', -90, 0);

INSERT INTO preference (glutenfree, vegetarian, vegan) VALUES
(true, false, false),
(false, true, true),
(false, true, false);

SELECT
	resname,
	osmid,
	glutenfree,
	vegetarian,
	vegan,
    earth_distance(
        ll_to_earth(restauraunt.locatLat, restauraunt.locatLong),
        ll_to_earth(0, 0)
    )::integer/1000 AS distance_kilometers
FROM restauraunt
INNER JOIN preference ON preference.prefid = restauraunt.prefid
WHERE
    earth_distance(
        ll_to_earth(locatLat, locatLong),
        ll_to_earth(0, 0)
    )/1000 < 6000
ORDER BY distance_kilometers;
