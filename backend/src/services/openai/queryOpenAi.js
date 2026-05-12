import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function queryOpenAi(prompt) {
  const response = await openai.responses.create({
    model: "gpt-5.4-mini",
    input: prompt,
  });

  const gptText = JSON.parse(response.output_text);

  return gptText;
}

export default queryOpenAi;
