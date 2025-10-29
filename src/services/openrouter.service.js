import axios from "axios";
import "dotenv/config";

export async function generateInsight(investorType, coins) {
  const prompt = `Give a 1-2 sentence crypto tip for a ${investorType} who follows ${coins.join(", ")}.`;

  const { data } = await axios.post(
    process.env.OPENROUTER_URL,
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 10000
    }
  );

  return data?.choices?.[0]?.message?.content ?? "";
}
