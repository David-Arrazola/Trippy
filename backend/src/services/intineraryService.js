import generatePrompt from "../utils/prompts/itineraryPrompt.js";
import getHotels from "./hotelService.js";
import searchFlights from "./flightService.js";
import queryOpenAi from "./openai/queryOpenAi.js";
import geocodeCities from "./geocodeService.js";

/**
 * AI TRIP GENERATION
 */

async function generateTrip(tripData) {
  const query = generatePrompt(tripData);

  const gptText = await queryOpenAi(query);

  console.log("THIS IS THE OUTPUT FROM GPT", gptText); //FIX DELETE

  gptText.cities = await geocodeCities(gptText.cities, tripData.destination);

  // =====================================================
  // HOTEL SEARCH LOGIC
  // =====================================================

  let hotelsByCity = [];

  const canSearchHotels =
    tripData.startDate && tripData.returnDate && gptText.cities?.length > 0;

  if (canSearchHotels) {
    for (const city of gptText.cities) {
      try {
        // ---------------------------------------------
        // OPTIONAL BUDGET LOGIC
        // ---------------------------------------------

        let maxPrice = null;

        if (tripData.budget && city.days) {
          const estimatedHotelBudget = tripData.budget * 0.35;

          const cityBudget =
            (estimatedHotelBudget / gptText.trip_summary.trip_length) *
            city.days;

          maxPrice = Math.floor(cityBudget / city.days);
        }

        // ---------------------------------------------
        // HOTEL SERVICE
        // ---------------------------------------------

        const hotels = await getHotels({
          cityName: city.name,
          destination: tripData.destination,
          checkInDate: city.check_in_date,
          checkOutDate: city.check_out_date,
          maxPrice,
        });

        hotelsByCity.push({
          city: city.name,

          // AI recommendation
          recommended: hotels[0] || null,

          // full filtered list
          hotels,
        });
      } catch (err) {
        console.error(`HOTEL ERROR FOR ${city.name}`, err);
      }
    }
  }

  // =====================================================
  // FLIGHT SEARCH
  // =====================================================

  let flights = null;

  const canSearchFlights =
    gptText.flight?.origin_airport &&
    gptText.flight?.destination_airport &&
    tripData.startDate &&
    tripData.returnDate;

  if (canSearchFlights) {
    flights = await searchFlights({
      origin: gptText.flight.origin_airport,
      destination: gptText.flight.destination_airport,
      startDate: tripData.startDate,
      returnDate: tripData.returnDate,
      budget: tripData.budget,
    });
  }

  // =====================================================
  // FINAL RESPONSE
  // =====================================================

  return {
    itinerary: gptText,
    hotels: hotelsByCity,
    flights,
  };
}

export default generateTrip;
