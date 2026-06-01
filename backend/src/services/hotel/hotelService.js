import { getJson } from "serpapi";
import scoreHotel from "./hotelScoreService.js";
import getCityHotspots from "../hotspots/cityHotspotService.js";

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
    sort_by: 8,
  };

  if (maxPrice) {
    params.max_price = maxPrice;
  }

  const response = await getJson(params);
  let hotels = response.properties || [];

  // -----------------------------------------
  // FILTER BAD DATA
  // -----------------------------------------
  hotels = hotels.filter((hotel) => {
    const hasName = hotel.name;
    const hasPrice = hotel.rate_per_night?.lowest || hotel.total_rate?.lowest;
    const hasRating = hotel.overall_rating;

    return hasName && hasPrice && hasRating && hotel.overall_rating >= 3;
  });

  // -----------------------------------------
  // HOTSPOTS
  // -----------------------------------------
  const hotspots = await getCityHotspots(cityName);

  // -----------------------------------------
  // SCORE + ENRICH DATA
  // -----------------------------------------
  hotels = hotels
    .map((hotel) => {
      const result = scoreHotel(hotel, hotspots, maxPrice);

      return {
        ...hotel,

        // main ranking score (used for sorting)
        score: result.score,

        // UI-friendly field (what you want to display)
        distance_to_hotspots_km: result.avgDistanceKm,

        // optional (future UI / debugging)
        breakdown: {
          ratingScore: result.ratingScore,
          priceScore: result.priceScore,
          distanceScore: result.distanceScore,
        },
      };
    })
    .sort((a, b) => b.score - a.score);

  // -----------------------------------------
  // RETURN TOP SET
  // -----------------------------------------
  return hotels.slice(0, 12);
}

export default getHotels;
