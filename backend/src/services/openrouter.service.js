import axios from "axios";
import config from "../config.js";

export async function generateInsight(investorType, coins) {
  const prompt = `Give a 1-2 sentence crypto tip for a ${investorType} who follows ${coins.join(", ")}.`;

  const { data } = await axios.post(
    config.openrouter.url,
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${config.openrouter.key}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    }
  );

  return data?.choices?.[0]?.message?.content ?? "";
}
