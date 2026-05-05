import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(cors({ origin: /localhost/ }));
app.use(express.json());

app.post("/", (req, res) => {
  console.log("reached backend");
});

export default app;
