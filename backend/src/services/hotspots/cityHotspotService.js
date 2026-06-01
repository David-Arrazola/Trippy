import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

async function getCityHotspots(cityName) {
  const res = await client.textSearch({
    params: {
      query: `top tourist attractions in ${cityName}`,
      key: process.env.GOOGLE_MAPS_KEY,
    },
  });

  return res.data.results.map((place) => ({
    name: place.name,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
  }));
}

export default getCityHotspots;
