import cors from "cors";

import express from "express";

import dotenv from "dotenv";



import authRoutes from "./routes/auth.js";

import itineraryRoutes from "./routes/itineraries.js";

import tripRoutes from "./routes/trip.js";



dotenv.config();



const app = express();



// app.use(cors({ origin: /localhost/ }));



app.use(

  cors({

    origin: "https://trippy-ochre.vercel.app",

  }),

);



app.use(express.json({ limit: "2mb" }));



app.get("/api/health", (_req, res) => {

  res.json({ status: "ok" });

});



app.use("/api/auth", authRoutes);

app.use("/api/itineraries", itineraryRoutes);

app.use("/api/trip", tripRoutes);
app.use("/", tripRoutes);

export default app;

