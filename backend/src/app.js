import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import generateTrip from "./services/openai/intineraryService.js";
import extractTripData from "./services/openai/extractTripData.js";

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

/**
 * MAIN ROUTE
 */
app.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const tripData = await extractTripData(message);
    console.log("THIS IS THE TRIP DATA", tripData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

export default app;
