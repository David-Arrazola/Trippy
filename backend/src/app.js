import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import generateTrip from "./services/intineraryService.js";

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

/**
 * MAIN ROUTE
 */
app.post("/", async (req, res) => {
  try {
    const { destination, startDate, returnDate, departureAirport, budget } =
      req.body;

    if (!startDate || !returnDate) {
      return res.status(400).json({
        error: "startDate and returnDate are required",
      });
    }

    const result = await generateTrip({
      destination: destination,
      startDate: startDate,
      returnDate: returnDate,
      departureAirport: departureAirport,
      budget: Number(budget),
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate trip" });
  }
});

export default app;
