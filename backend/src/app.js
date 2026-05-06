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

app.post("/", async (req, res) => {
  try {
    const { destination, tripLength, budget, departureAirport, startDate } =
      req.body;

    const result = await generateTrip(
      destination,
      Number(tripLength),
      Number(budget),
      departureAirport,
      startDate,
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

async function generateTrip(
  destination,
  tripLength,
  budget,
  departureAirport,
  startDate,
) {
  const query = `
You are a precise AI travel planning engine.

USER INPUT:
- Destination: ${destination}
- Departure Airport: ${departureAirport}
- Start Date: ${startDate}
- Trip Duration: ${tripLength} days
- Total Budget: ${budget}

TASK:
Create a structured travel itinerary AND determine correct airport codes.

HARD CONSTRAINTS:
1. Total days MUST equal ${tripLength}.
2. Total budget MUST equal ${budget}.
3. Output MUST be valid JSON only.

AIRPORT RULES:
- Treat departureAirport as already an IATA code if possible.
- If not, convert it to valid IATA code.
- Convert destination to nearest major airport code.

PROCESS:
- Determine airports
- Build itinerary
- Allocate budget
- Validate totals

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "trip_summary": {
    "destination": "${destination}",
    "total_days": ${tripLength},
    "total_budget": ${budget}
  },
  "flight": {
    "origin_airport": "IATA",
    "destination_airport": "IATA",
    "start_date": "${startDate}"
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

  console.log("AI RESULT:", text); //fix DELETE LATER

  // HOTEL SEARCH (fixed usage)
  const firstCity = text.cities[0].name;

  const hotels = await getHotels(firstCity, destination);
  console.log("HOTELS IN FIRST CITY", hotels); //fix DELETE LATER

  // const filteredHotels = filterHotels(hotels, budget);

  const flights = await searchFlights(
    text.flight.origin_airport,
    text.flight.destination_airport,
    text.flight.start_date,
  );
  console.log("FLIGHTS TO DESTINATION", flights); //fix DELETE LATER

  return {
    trip: text,
    flights,
    hotels: filteredHotels,
  };
}

async function getHotels(city, destination) {
  const query = `hotels in ${city}, ${destination}`;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${process.env.GOOGLE_PLACES_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.results;
}

async function searchFlights(origin, destination, startDate) {
  const response = await getJson("google_flights", {
    api_key: process.env.SERP_API_KEY,

    departure_id: origin,
    arrival_id: destination,
    outbound_date: startDate,

    currency: "USD",
    hl: "en",
    gl: "us",
  });

  return response;
}

export default app;
