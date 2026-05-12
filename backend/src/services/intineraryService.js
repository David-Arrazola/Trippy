import generatePrompt from "../utils/prompts/itineraryPrompt.js";
import getHotels from "./hotelService.js";
import searchFlights from "./flightService.js";
import queryOpenAi from "./openai/queryOpenAi.js";

/**
 * AI TRIP GENERATION
 */

async function generateTrip(tripData) {
  const query = generatePrompt(tripData);

  const response = await queryOpenAi(query);

  const gptText = JSON.parse(response.output_text);

  console.log("AI RESULT:", gptText); //FIX DELETE LATER

  // -------------------------
  // HOTEL SEARCH
  // -------------------------
  const firstCity = gptText.cities?.[0];

  const hotels = await getHotels(firstCity, tripData.destination);
  console.log("HOTELS IN FIRST CITY", hotels); //fix DELETE LATER

  // -------------------------
  // FLIGHT SEARCH (FIXED)
  // -------------------------
  const flights = await searchFlights(
    gptText.flight.origin_airport,
    gptText.flight.destination_airport,
    tripData.startDate,
    tripData.returnDate,
  );

  console.log("FLIGHTS TO DESTINATION", flights); //fix DELETE LATER
}

export default generateTrip;
