


export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        // Handle common cases
        if (err.code === err.PERMISSION_DENIED) {
          reject("User denied location permission");
        } else {
          reject("Unable to retrieve location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  });
}
