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
  // OPTIONAL PRICE FILTER
  // -----------------------------------------

  if (maxPrice) {
    params.max_price = maxPrice;
  }

  const response = await getJson(params);

  const hotels = response.properties || [];

  // =====================================================
  // FILTER BAD RESULTS
  // =====================================================

  const filteredHotels = hotels.filter((hotel) => {
    const hasName = hotel.name;

    const hasPrice = hotel.rate_per_night?.lowest || hotel.total_rate?.lowest;

    const hasRating = hotel.overall_rating;

    const validRating = hotel.overall_rating >= 3.0;

    return hasName && hasPrice && hasRating && validRating;
  });

  // =====================================================
  // SORT BEST HOTELS
  // =====================================================

  filteredHotels.sort((a, b) => {
    // prioritize higher rated hotels

    if (b.overall_rating !== a.overall_rating) {
      return b.overall_rating - a.overall_rating;
    }

    // then prioritize cheaper hotels

    const priceA = a.rate_per_night?.lowest || a.total_rate?.lowest || Infinity;

    const priceB = b.rate_per_night?.lowest || b.total_rate?.lowest || Infinity;

    return priceA - priceB;
  });

  // =====================================================
  // RETURN TOP OPTIONS
  // =====================================================

  return filteredHotels.slice(0, 12);
}

export default getHotels;
