import { getJson } from "serpapi";

async function getHotels({
  cityName,
  destination,
  checkInDate,
  checkOutDate,
  maxPrice,
}) {
  const params = {
    engine: "google_hotels",

    api_key: process.env.SERP_API_KEY,

    q: `${cityName} hotels in ${destination}`,

    check_in_date: checkInDate,
    check_out_date: checkOutDate,

    currency: "USD",
    gl: "us",
    hl: "en",

    sort_by: 8, // highest rating
  };

  // -----------------------------------------
  // ONLY APPLY PRICE FILTER IF BUDGET EXISTS
  // -----------------------------------------

  if (maxPrice) {
    params.max_price = maxPrice;
  }

  const response = await getJson(params);

  return response.properties || [];
}

export default getHotels;
