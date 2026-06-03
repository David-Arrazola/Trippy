import avgDistanceToHotspots from "../hotspots/distToHotspotService.js";

const MAX_DISTANCE_KM = 10;

function scoreHotel(hotel, hotspots, maxPrice) {
  const rating = hotel.overall_rating || 3;

  const price =
    hotel.rate_per_night?.lowest || hotel.total_rate?.lowest || maxPrice || 200;

  // -----------------------------------------
  // DISTANCE SCORE (PRIMARY FACTOR)
  // -----------------------------------------
  const avgDist = avgDistanceToHotspots(hotel, hotspots);

  const distanceScore =
    avgDist > MAX_DISTANCE_KM ? 0 : (1 - avgDist / MAX_DISTANCE_KM) * 10;

  // -----------------------------------------
  // PRICE SCORE (SECONDARY FACTOR)
  // -----------------------------------------
  const priceScore = maxPrice
    ? Math.max(0, ((maxPrice - price) / maxPrice) * 10)
    : 5;

  // -----------------------------------------
  // FINAL SCORE (ONLY PRICE + DISTANCE)
  // -----------------------------------------
  const finalScore = distanceScore * 0.6 + priceScore * 0.4;

  return {
    score: finalScore,

    // 👇 still returned for UI
    rating,

    avgDistanceKm: avgDist,
    priceScore,
    distanceScore,
  };
}

export default scoreHotel;
