import { Router } from "express";
import generateTrip from "../services/intineraryService.js";
import queryOpenAi from "../services/openai/queryOpenAi.js";
import extractDataPrompt from "../utils/prompts/extractDataPrompt.js";
import canPlanTripPrompt from "../utils/prompts/canPlanTripPrompt.js";
import resolveDepartureAirport from "../services/closestAirportService.js";
import resolveTripDates from "../utils/resolveTripDates.js";

const router = Router();

async function decideIfEnoughInfo(tripData, userInput) {
  const prompt = canPlanTripPrompt(tripData, userInput);
  const response = await queryOpenAi(prompt);

  return {
    canPlan: response?.action === "GENERATE_TRIP",
    followUpMessage: response?.followUpQuestion,
  };
}

router.post("/", async (req, res) => {
  try {
    const { userInput, tripState, userLocation, clientDate } = req.body;
    const referenceDate = clientDate ?? new Date().toISOString().slice(0, 10);

    const extractionPrompt = extractDataPrompt(
      userInput,
      tripState,
      referenceDate,
    );
    let tripData = await queryOpenAi(extractionPrompt);

    tripData.departureAirport = await resolveDepartureAirport(
      tripData,
      userLocation,
    );

    tripData = resolveTripDates(tripData, referenceDate);

    const { canPlan, followUpMessage } = await decideIfEnoughInfo(
      tripData,
      userInput,
    );

    if (canPlan) {
      const tripResult = await generateTrip(tripData);

      return res.json({
        action: "GENERATE_TRIP",
        followUpMessage: "Generating your itinerary",
        trip: tripResult,
      });
    }

    return res.json({
      action: "ASK_FOLLOWUP",
      followUpMessage,
      trip: tripData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate trip" });
  }
});

export default router;
