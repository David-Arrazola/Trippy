import { getJson } from "serpapi";

/**
 * SEARCH FLIGHTS
 */
async function searchFlights({
  origin,
  destination,
  startDate,
  returnDate,
  budget,
}) {
  // ---------------------------------------------
  // OPTIONAL FLIGHT BUDGET LOGIC
  // ---------------------------------------------

  let maxPrice = undefined;

  // Allocate about 40% of total budget to flights
  if (budget) {
    maxPrice = Math.floor(budget * 0.4);

    console.log("MAX FLIGHT BUDGET:", maxPrice);
  }

  // ---------------------------------------------
  // SERP API REQUEST
  // ---------------------------------------------

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

    sort_by: "2", // cheapest first
    deep_search: true,

    ...(maxPrice && {
      max_price: maxPrice,
    }),
  });

  // ---------------------------------------------
  // COMBINE FLIGHT RESULTS
  // ---------------------------------------------

  const allFlights = [
    ...(response.best_flights || []),
    ...(response.other_flights || []),
  ];
  // ---------------------------------------------
  // REMOVE TERRIBLE FLIGHTS
  // ---------------------------------------------

  const filteredFlights = allFlights.filter((flight) => {
    // Remove overnight layovers
    const hasOvernightLayover = flight.layovers?.some(
      (layover) => layover.overnight,
    );

    // Remove absurdly long flights
    const tooLong = flight.total_duration > 1500;

    return !hasOvernightLayover && !tooLong;
  });

  // ---------------------------------------------
  // SORT BEST OPTIONS
  // ---------------------------------------------

  filteredFlights.sort((a, b) => {
    // prioritize cheaper flights
    return a.price - b.price;
  });

  // ---------------------------------------------
  // RETURN BEST 2 FLIGHTS
  // ---------------------------------------------

  return filteredFlights.slice(0, 10);
}

export default searchFlights;
