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
app.post("/", async (req, res) => {
  try {
    const { message, tripState } = req.body;

    // -------------------------
    // EXTRACT TRIP DATA
    // -------------------------
    const extractionPrompt = extractDataPrompt(message);

    const tripData = await queryOpenAi(extractionPrompt);

    console.log("EXTRACTED TRIP DATA:", tripData);

    // -------------------------
    // DETERMINE IF WE CAN PLAN
    // -------------------------
    const [canPlan, followUpMessage] = await decideIfEnoughInfo(tripData);

    // -------------------------
    // GENERATE FULL TRIP
    // -------------------------
    if (canPlan) {
      const trip = await generateTrip(tripData);

      return res.send({
        action: "GENERATE_TRIP",
        message: followUpMessage,
        tripData: tripData,
      });
    }

    // -------------------------
    // ASK FOLLOW-UP QUESTION
    // -------------------------
    return res.send({
      action: "ASK_FOLLOWUP",
      message: followUpMessage,
      tripData: tripData,
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
async function decideIfEnoughInfo(tripData) {
  const prompt = canPlanTripPrompt(tripData);

  const response = await queryOpenAi(prompt);

  console.log("PLAN DECISION:", response);

  const { action, message } = response;

  return action === "GENERATE_TRIP" ? [true, message] : [false, message];
}

export default app;
