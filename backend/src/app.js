import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import generateTrip from "./services/intineraryService.js";
import queryOpenAi from "./services/openai/queryOpenAi.js";
import extractDataPrompt from "./utils/prompts/extractDataPrompt.js";

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

/**
 * MAIN ROUTE
 */
app.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = extractDataPrompt(message);
    const tripData = await queryOpenAi(prompt);
    console.log("THIS IS THE TRIP DATA", tripData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

export default app;
