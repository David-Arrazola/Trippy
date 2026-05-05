import cors from "cors";
import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

app.post("/", async (req, res) => {
  const { destination, tripLength, budget } = req.body;
  await generateTrip(destination, tripLength, budget);
});

async function generateTrip(destination, tripLength, budget) {
  const query = `
    You are a precise AI travel planning engine.

    You MUST follow all user constraints exactly. Do not approximate, assume, or modify any numeric values.

    USER INPUT:
    - Destination: ${destination}
    - Total Trip Duration: ${tripLength} days
    - Total Budget: ${budget}

    TASK:
    Create a structured travel itinerary.

    HARD CONSTRAINTS (must follow exactly):
    1. The total number of days across all cities MUST equal ${tripLength}.
    2. You MUST NOT change or reinterpret the duration value.
    3. You MUST NOT default to common trip lengths (e.g., 7 or 10 days).
    4. The sum of all "days" fields must exactly match ${tripLength}.
    5. The sum of all "allocated_budget" must exactly match ${budget}.
    6. Output must be valid JSON only (no extra text, no markdown).

    PROCESS (do this internally before responding):
    - First, decide how to split ${tripLength} days across 1–3 cities.
    - Then allocate budget proportionally.
    - Then verify totals are correct before outputting.

    OUTPUT FORMAT (STRICT JSON ONLY):

    {
      "trip_summary": {
        "destination": "string",
        "total_days": ${tripLength},
        "total_budget": ${budget},
        "style": "budget | balanced | luxury"
      },
      "cities": [
        {
          "name": "string",
          "days": number,
          "allocated_budget": number,
          "budget_per_night": number,
          "highlights": [
            "string",
            "string",
            "string"
          ]
        }
      ]
    }

    FINAL VALIDATION RULE:
    Before responding, verify:
    - sum(cities.days) == ${tripLength}
    - sum(cities.allocated_budget) == ${budget}

    If not correct, fix it before output.
`;

  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: query,
    store: true,
  });
  console.log(response);
}

export default app;
