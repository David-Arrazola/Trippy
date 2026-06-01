import avgDistanceToHotspots from "../hotspots/distToHotspotService.js";

function scoreHotel(hotel, hotspots, maxPrice) {
  const rating = hotel.overall_rating || 3;

  const price =
    hotel.rate_per_night?.lowest || hotel.total_rate?.lowest || maxPrice || 200;

  // Distance penalty (lower is better)
  const avgDist = avgDistanceToHotspots(hotel, hotspots);

  const distanceScore = Math.max(0, 10 - avgDist);

  // Normalize price score
  const priceScore = maxPrice
    ? Math.max(0, ((maxPrice - price) / maxPrice) * 10)
    : 5;

  const ratingScore = rating * 2;

  return ratingScore + priceScore + distanceScore;
}

export default scoreHotel;
