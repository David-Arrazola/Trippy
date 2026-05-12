import generatePrompt from "../../utils/prompts/itineraryPrompt.js";
import dotenv from "dotenv";
import OpenAI from "openai";
import getHotels from "../hotelService.js";
import searchFlights from "../flightService.js";

dotenv.config();
/**
 * AI TRIP GENERATION
 */

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTrip(tripData) {
  const query = generatePrompt(tripData);

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: query,
  });

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
