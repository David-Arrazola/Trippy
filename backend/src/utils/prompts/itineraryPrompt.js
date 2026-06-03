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
    4. Accumulation of days in different cities MUST add up to total trip length.
    5. Daily itineraries MUST match the number of days assigned to each city.

    AIRPORT RULES:
    - Use the provided departureAirport if available.
    - IF "departureAirport" IS NOT an actual international/popular commercial airport, then FIND the closest major airport to the departureAirport.
    - Convert departureAirport to IATA.
    - Convert destination to closest major airport.

    CITY RULES:
    - Per each city, calculate how many days a user should be in that city (given the total length of the trip).
    - VERY IMPORTANT!! IF no cities are provided by the user, then YOU must recommend cities to go to in their destination,
      AND the time per city should all add up to their trip duration.

    ITINERARY RULES:
    - For every city, generate a detailed day-by-day itinerary.
    - The number of itinerary days MUST equal the number of days allocated to that city.
    - Every day MUST contain:
      - morning
      - afternoon
      - evening
    - Activities should be realistic for the city.
    - Activities should avoid duplication.
    - Activities should fit within the user's budget.
    - Activities should be geographically sensible.
    - Activities should include famous attractions, food, culture, nature, nightlife, shopping, or local experiences when appropriate.
    - Each time block should contain between 1 and 3 activities.

    OUTPUT FORMAT (STRICT JSON ONLY):

    {
      "trip_summary": {
        "destination": "${tripData.destination}",
        "total_budget": ${tripData.budget},
        "trip_length": number
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

          "check_in_date": "YYYY-MM-DD",

          "check_out_date": "YYYY-MM-DD",

          "allocated_budget": number,

          "budget_per_night": number,

          "highlights": [
            "string",
            "string",
            "string"
          ],

          "daily_itinerary": [
            {
              "day": number,

              "morning": [
                "activity",
                "activity"
              ],

              "afternoon": [
                "activity",
                "activity"
              ],

              "evening": [
                "activity",
                "activity"
              ]
            }
          ]
        }
      ]
    }`;

  return query;
}

export default generatePrompt;
