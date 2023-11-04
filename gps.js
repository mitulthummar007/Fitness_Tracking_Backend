const gps = require('gps');
const Geolib = require('geolib');

// Create a GPS parser
const gpsParser = new gps();
// Initialize variables to store GPS data
let lastLocation = null; // Store the last location
gpsParser.on('data', (data) => {
  if (data.type === 'GGA' && data.lat && data.lon) {
    const currentLocation = {
      latitude: data.lat,
      longitude: data.lon,
    };

    if (lastLocation) {
      const distance = Geolib.getDistance(lastLocation, currentLocation); // Calculate distance in meters
      console.log(`Distance traveled: ${distance} meters`);
    }

    lastLocation = currentLocation;
  }
});

// You can further process GPS data, store it in the database, or use it for mapping routes.

module.exports = gpsParser;
