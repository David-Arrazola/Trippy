import { getJson } from "serpapi";

async function getHotels(city, destination) {
  const response = await getJson("google_hotels", {
    api_key: process.env.SERP_API_KEY,
    q: `Good hotels in ${city.name}, ${destination}`,
    check_in_date: city.check_in_date,
    check_out_date: city.check_out_date,
  });
  return response;
}

export default getHotels;
