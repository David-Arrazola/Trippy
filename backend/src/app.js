import cors from "cors";
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import { getJson } from "serpapi";

dotenv.config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

/**
 * MAIN ROUTE
 */
app.post("/", async (req, res) => {
  try {
    const { destination, startDate, returnDate, budget, departureAirport } =
      req.body;

    if (!startDate || !returnDate) {
      return res.status(400).json({
        error: "startDate and returnDate are required",
      });
    }

    const result = await generateTrip(
      destination,
      startDate,
      returnDate,
      Number(budget),
      departureAirport,
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

/**
 * AI TRIP GENERATION
 */
async function generateTrip(
  destination,
  startDate,
  returnDate,
  budget,
  departureAirport,
) {
  const query = `
You are a precise AI travel planning engine.

USER INPUT:
- Destination: ${destination}
- Departure Airport: ${departureAirport}
- Start Date: ${startDate}
- Return Date: ${returnDate}
- Total Budget: ${budget}

TASK:
Create a structured travel itinerary AND determine correct airport codes.

HARD CONSTRAINTS:
1. Output MUST be valid JSON only.
2. Budget must equal ${budget}.
3. Use realistic travel planning.

AIRPORT RULES:
- Convert departureAirport to IATA if needed.
- Convert destination to closest major airport.

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "trip_summary": {
    "destination": "${destination}",
    "total_budget": ${budget}
  },
  "flight": {
    "origin_airport": "IATA",
    "destination_airport": "IATA",
    "start_date": "${startDate}",
    "return_date": "${returnDate}"
  },
  "cities": [
    {
      "name": "string",
      "days": number,
      "allocated_budget": number,
      "budget_per_night": number,
      "highlights": ["string","string","string"]
    }
  ]
}
`;

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: query,
  });

  const text = JSON.parse(response.output_text);

  console.log("AI RESULT:", text); //FIX DELETE LATER

  // -------------------------
  // HOTEL SEARCH
  // -------------------------
  const firstCity = text.cities?.[0]?.name;

  const hotels = await getHotels(firstCity, destination);

  const rankedHotels = rankHotels(hotels, budget);

  console.log("RANKED HOTELS", rankHotels);

  // -------------------------
  // FLIGHT SEARCH (FIXED)
  // -------------------------
  const flights = await searchFlights(
    text.flight.origin_airport,
    text.flight.destination_airport,
    startDate,
    returnDate,
  );

  console.log("FLIGHTS TO DESTINATION", flights);

  return {
    trip: text,
    flights,
    hotels: rankedHotels.slice(0, 10),
  };
}

/**
 * GOOGLE PLACES HOTELS
 */
async function getHotels(city, destination) {
  const query = `hotels in ${city}, ${destination}`;

  const url =
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=` +
    encodeURIComponent(query) +
    `&key=${process.env.GOOGLE_PLACES_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results || [];
}

/**
 * HOTEL SCORING SYSTEM (price + rating)
 */
function rankHotels(hotels, budget) {
  return hotels
    .map((hotel) => {
      const price = hotel?.rate_per_night?.extracted_lowest || 0;
      const rating = hotel?.overall_rating || 0;

      const priceScore = price > 0 ? 1 / price : 0;
      const ratingScore = rating / 5;

      return {
        ...hotel,
        score: ratingScore * 0.7 + priceScore * 0.3,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * SERPAPI FLIGHTS
 */
async function searchFlights(origin, destination, startDate, returnDate) {
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
  });

  return response;
}

export default app;
