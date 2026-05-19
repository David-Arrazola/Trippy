import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import generateTrip from "./services/intineraryService.js";
import queryOpenAi from "./services/openai/queryOpenAi.js";

import extractDataPrompt from "./utils/prompts/extractDataPrompt.js";
import canPlanTripPrompt from "./utils/prompts/canPlanTripPrompt.js";

dotenv.config();

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

/**
 * MAIN ROUTE
 */
//TODO EDIT the itineraryService.js file so it takes in "tripData" correctly.
//TODO internaryService.js should only recommend cities to trip plan only if user DOESN't specify cities in the prompt
//TODO QUERY hotels only if user gives a startTripDate and returnTripDate and their budget
//Todo Query flights only if user says they are flying/departing from a specific airport + what it says in line 23
app.post("/", async (req, res) => {
  try {
    const { userInput, tripState } = req.body;

    // -------------------------
    // EXTRACT TRIP DATA
    // -------------------------
    const extractionPrompt = extractDataPrompt(userInput, tripState);
    const tripData = await queryOpenAi(extractionPrompt);

    console.log("EXTRACTED TRIP DATA:", tripData); //fix DELETE LATER

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
      console.log("THIS IS THE TRIPDATA", tripData); //fix DELETE
      const trip = await generateTrip(tripData);

      return res.json({
        action: "GENERATE_TRIP",
        followUpMessage: "Generating your itinerary",
        trip: trip,
      });
    }

    // -------------------------
    // ASK FOLLOW-UP
    // -------------------------
    return res.json({
      action: "ASK_FOLLOWUP",
      followUpMessage,
      tripData,
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

  console.log("PLAN DECISION:", response); //fix DELETE LATER

  const action = response?.action;
  const followUpMessage = response?.followUpQuestion;

  return {
    canPlan: action === "GENERATE_TRIP",
    followUpMessage,
  };
}

export default app;
