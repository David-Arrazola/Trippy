import { getJson } from "serpapi";
/**
 * SERPAPI FLIGHTS
 */
async function searchFlights(origin, destination, startDate, returnDate) {
  const response = await getJson("google_flights", {
    api_key: process.env.SERP_API_KEY,

    departure_id: origin,
    arrival_id: destination,

    outbound_date: startDate,
    return_date: returnDate,

    type: "1", // round trip

    currency: "USD",
    hl: "en",
    gl: "us",
  });

  return response;
}

export default searchFlights;
