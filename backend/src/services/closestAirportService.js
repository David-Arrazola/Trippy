import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

async function resolveDepartureAirport(tripData, userLocation) {
  // If user already provided airport → respect it
  if (tripData.departureAirport) {
    return tripData.departureAirport;
  }

  // If we have coordinates → find closest airport
  if (userLocation?.lat && userLocation?.lng) {
    const airport = await getNearestAirport(userLocation.lat, userLocation.lng);

    console.log("CLOSEST AIRPORT", airport?.name);
    return airport?.name;
  }

  return null;
}

async function getNearestAirport(lat, lng) {
  const res = await client.placesNearby({
    params: {
      location: { lat, lng },
      radius: 50000, // 50km
      type: "airport",
      key: process.env.GOOGLE_MAPS_KEY,
    },
  });

  const airports = res.data.results;

  if (!airports.length) return null;

  return {
    name: airports[0].name,
  };
}

export default resolveDepartureAirport;
