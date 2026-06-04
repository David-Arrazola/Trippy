import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import generateTrip from "./services/intineraryService.js";
import queryOpenAi from "./services/openai/queryOpenAi.js";

import extractDataPrompt from "./utils/prompts/extractDataPrompt.js";
import canPlanTripPrompt from "./utils/prompts/canPlanTripPrompt.js";
import resolveDepartureAirport from "./services/closestAirportService.js";

dotenv.config();

const app = express();

// app.use(cors({ origin: /localhost/ }));

app.use(
  cors({
    origin: "https://trippy-9uju1g2u1-david-arrazola-s-projects.vercel.app/",
  }),
);

app.use(express.json());

/**
 * MAIN ROUTE
 */
app.post("/", async (req, res) => {
  try {
    const { userInput, tripState, userLocation } = req.body;

    // -------------------------
    // EXTRACT TRIP DATA
    // -------------------------
    const extractionPrompt = extractDataPrompt(userInput, tripState);
    const tripData = await queryOpenAi(extractionPrompt);

    tripData.departureAirport = await resolveDepartureAirport(
      tripData,
      userLocation,
    );

    // -------------------------
    // DETERMINE IF WE CAN PLAN
    // -------------------------
    const { canPlan, followUpMessage } = await decideIfEnoughInfo(
      tripData,
      userInput,
    );

    // -------------------------
    // GENERATE TRIP
    // -------------------------
    if (canPlan) {
      const tripResult = await generateTrip(tripData);

      return res.json({
        action: "GENERATE_TRIP",
        followUpMessage: "Generating your itinerary",
        trip: tripResult,
      });
    }

    // -------------------------
    // ASK FOLLOW-UP
    // -------------------------
    return res.json({
      action: "ASK_FOLLOWUP",
      followUpMessage,
      trip: tripData,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to generate trip",
    });
  }
});

/**
 * DECIDES IF WE HAVE ENOUGH INFO
 */
async function decideIfEnoughInfo(tripData, userInput) {
  const prompt = canPlanTripPrompt(tripData, userInput);

  const response = await queryOpenAi(prompt);

  const action = response?.action;
  const followUpMessage = response?.followUpQuestion;

  return {
    canPlan: action === "GENERATE_TRIP",
    followUpMessage,
  };
}

export default app;
