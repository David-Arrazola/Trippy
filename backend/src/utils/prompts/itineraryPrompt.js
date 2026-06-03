function generatePrompt(tripData) {
  const query = `
You are a precise AI travel planning engine.

USER INPUT:
- Destination: ${tripData.destination}
- Cities: ${tripData.cities}
- Duration: ${tripData.duration}
- Budget: ${tripData.budget}
- Departure Airport: ${tripData.departureAirport}
- Start Date: ${tripData.startDate}
- Return Date: ${tripData.returnDate}

TASK:
Create a structured travel itinerary.

HARD CONSTRAINTS:
1. Output MUST be valid JSON only
2. No repeated activities across days
3. Activities must fit budget
4. Must be realistic & geographically logical
5. Each city must include a day-by-day itinerary

ITINERARY RULES:
- Each city has a daily itinerary
- Each day MUST contain 3–6 activities
- NO morning/afternoon/evening split
- DO NOT repeat activities across days

OUTPUT FORMAT:

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

      "highlights": ["string"],

      "daily_itinerary": [
        {
          "day": number,
          "activities": ["activity 1", "activity 2", "activity 3", "activity 4", etc]
        }
      ]
    }
  ]
}
`;

  return query;
}

export default generatePrompt;
