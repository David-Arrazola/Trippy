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
- Trip Length: you have to calculate this by subtracting "Start Date" from "Return Date => ${returnDate} - ${startDate}.  

TASK:
Create a structured travel itinerary AND determine correct airport codes.

HARD CONSTRAINTS:
1. Output MUST be valid JSON only.
2. Budget must equal ${budget}.
3. Use realistic travel planning.
4. Accumulation of days in different hotels/city MUST add up to total trip length

AIRPORT RULES:
- Convert departureAirport to IATA if needed.
- Convert destination to closest major airport.

CITY RULES:
- Per each city, calculate how many days a user should be in that city (given the total length of the trip)

OUTPUT FORMAT (STRICT JSON ONLY):

{
  "trip_summary": {
    "destination": "${destination}",
    "total_budget": ${budget},
    "trip_length": - Trip Length: you have to calculate this by subtracting "Start Date" from "Return Date => ${returnDate} - ${startDate}.  

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
      "check_in_date": number,
      "check_out_date": number,
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
  const firstCity = text.cities?.[0];

  const hotels = await getHotels(firstCity, destination);
  console.log("HOTELS IN FIRST CITY", hotels);

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
}

async function getHotels(city, destination) {
  const response = await getJson("google_hotels", {
    api_key: process.env.SERP_API_KEY,
    q: `Good hotels in ${city.name}, ${destination}`,
    check_in_date: city.check_in_date,
    check_out_date: city.check_out_date,
  });
  return response;
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
