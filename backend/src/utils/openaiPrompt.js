function generatePrompt(tripData) {
  const { destination, startDate, returnDate, departureAirport, budget } =
    tripData;

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
    }`;

  return query;
}

export default generatePrompt;
