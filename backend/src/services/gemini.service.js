import axios from "axios";
import config from "../config.js";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

export async function generateInsight(investorType, coins) {
  const prompt = `Give a 1-2 sentence crypto tip for a ${investorType} who follows ${coins.join(", ")}.`;
  return await callGemini(prompt);
}

export async function generateInsights(count = 3, { coins, investorType, risk, depth } = {}) {
  const contextParts = [];
  if (coins?.length) contextParts.push(`The user follows: ${coins.join(", ")}.`);
  if (investorType) contextParts.push(`Investor style: ${investorType}.`);
  if (risk) contextParts.push(`Risk tolerance: ${risk}.`);
  const lengthHint = depth === "DEEP" ? "3-4 sentence" : depth === "MEDIUM" ? "2-3 sentence" : "1-2 sentence";
  const context = contextParts.length > 0 ? `\n\nUser context: ${contextParts.join(" ")}` : "";

  const prompt = `Generate ${count} unique, actionable crypto market insights for today. Each should cover a different topic (e.g. market trends, DeFi, regulation, altcoins, trading strategy).${context}

Return ONLY a JSON array, no markdown, no code fences. Each object must have:
- "title": short headline (5-8 words)
- "text": ${lengthHint} analysis or tip tailored to the user context above
- "tags": array of 2-3 lowercase topic tags
- "tickers": array of relevant coin symbols (e.g. ["BTC", "ETH"]), empty array if general`;

  const raw = await callGemini(prompt, 0.8);

  try {
    const cleaned = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i.title && i.text);
  } catch {
    return [];
  }
}

async function callGemini(prompt, temperature = 0.7) {
  const { data } = await axios.post(
    API_URL,
    {
      model: "gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${config.gemini.key}`,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    }
  );

  return data?.choices?.[0]?.message?.content ?? "";
}
