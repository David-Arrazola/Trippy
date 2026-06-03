import { getJson } from "serpapi";
import scoreHotel from "./hotelScoreService.js";
import getCityHotspots from "../hotspots/cityHotspotService.js";

const MAX_DISTANCE_KM = 10; // hard cutoff (~6 miles)

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

  if (maxPrice) params.max_price = maxPrice;

  const response = await getJson(params);
  let hotels = response.properties || [];

  // -----------------------------------------
  // STRICT QUALITY FILTER
  // -----------------------------------------
  hotels = hotels.filter((hotel) => {
    return (
      hotel.name &&
      hotel.rate_per_night?.lowest &&
      hotel.overall_rating &&
      hotel.overall_rating >= 3.5
    );
  });

  // -----------------------------------------
  // HOTSPOTS
  // -----------------------------------------
  const hotspots = await getCityHotspots(cityName);

  // -----------------------------------------
  // SCORE HOTELS
  // -----------------------------------------
  const scoredHotels = hotels.map((hotel) => {
    const result = scoreHotel(hotel, hotspots, maxPrice);

    return {
      ...hotel,
      score: result.score,
      distance_km: result.avgDistanceKm,
      rating: result.rating,
      price: hotel.rate_per_night?.lowest || hotel.total_rate?.lowest,
    };
  });

  // -----------------------------------------
  // HARD DISTANCE FILTER
  // -----------------------------------------
  const nearbyHotels = scoredHotels.filter(
    (hotel) => hotel.distance_km <= MAX_DISTANCE_KM,
  );

  // ❗ NO FALLBACK TO BAD HOTELS
  const finalHotels = nearbyHotels;

  // -----------------------------------------
  // SORT BEST FIRST
  // -----------------------------------------
  finalHotels.sort((a, b) => b.score - a.score);

  // -----------------------------------------
  // RETURN TOP RESULTS
  // -----------------------------------------
  return finalHotels.slice(0, 10);
}

export default getHotels;
