import { fetchFirstHotPost } from "../services/cryptopanic.service.js";
import { fetchSimplePrice } from "../services/coingecko.service.js";
import { generateInsight } from "../services/openrouter.service.js";
import { fetchOneMeme } from "../services/reddit.service.js";

export async function getOneNews(_req, res) {
  try {
    const item = await fetchFirstHotPost();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch news from CryptoPanic" });
  }
}

export async function getOnePrice(_req, res) {
  try {
    const item = await fetchSimplePrice();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch price from CoinGecko" });
  }
}

export async function postOneInsight(req, res) {
  const { investorType = "HODL", coins = ["BTC", "ETH"] } = req.body || {};
  try {
    const text = await generateInsight(investorType, coins);
    res.json({ text });
  } catch {
    res.status(502).json({ error: "Failed to generate insight from OpenRouter" });
  }
}

export async function getOneMeme(_req, res) {
  try {
    const item = await fetchOneMeme();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch meme from Reddit" });
  }
}
