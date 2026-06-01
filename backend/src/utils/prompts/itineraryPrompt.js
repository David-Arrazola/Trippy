function generatePrompt(tripData) {
  const query = `
    You are a precise AI travel planning engine.

    USER INPUT:
    - Destination: ${tripData.destination}
    - Cities: ${tripData.cities}
    - Duration: ${tripData.duration}
    - Budget for trip: ${tripData.budget}
    - Departure Airport: ${tripData.departureAirport}
    - Start Date: ${tripData.startDate}
    - Return Date: ${tripData.returnDate}
    - Trip Length: you have to calculate this by subtracting "Start Date" from "Return Date => ${tripData.returnDate} - ${tripData.startDate}.
     ---> This calculation is only needed if a "trip duration" is not right out provided  

    TASK:
    Create a structured travel itinerary AND determine correct airport codes.

    HARD CONSTRAINTS:
    1. Output MUST be valid JSON only.
    2. Budget must equal ${tripData.budget}.
    3. Use realistic travel planning.
    4. Accumulation of days in different hotels/city MUST add up to total trip length

    AIRPORT RULES:
    - IMPORTANT!!! DO NOT, recommend or add an airport to the returned tripData IF the user never inputed the departure airport
    - IF "departureAirport" IS NOT an actual international/popular commercial airport, then FIND the closest major airport to the departureAirport
    - Convert departureAirport to IATA.
    - Convert destination to closest major airport.

    CITY RULES:
    - Per each city, calculate how many days a user should be in that city (given the total length of the trip)
    - VERY IMPORTANT!! IF no cities are provided by the user, then YOU must recommend cities to go to in their destination,
      AND the time per city should all add up to their trip duration

    OUTPUT FORMAT (STRICT JSON ONLY):

    {
    "trip_summary": {
        "destination": "${tripData.destination}",
        "total_budget": ${tripData.budget},
        "trip_length": - Trip Length: you have to calculate this by subtracting "Start Date" from "Return Date => ${tripData.returnDate} - ${tripData.startDate}.  

    },
    "flight": {
        "origin_airport": "IATA",
        "destination_airport": "IATA",
        "start_date": "${tripData.startDate}",
        "return_date": "${tripData.returnDate}"
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
