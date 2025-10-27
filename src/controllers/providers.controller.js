import { fetchFirstHotPost } from "../services/cryptopanic.service.js";
import { fetchSimplePrice }  from "../services/coingecko.service.js";
import { generateInsight }   from "../services/openrouter.service.js";
import { fetchOneMeme }      from "../services/reddit.service.js";

export async function getOneNews(req, res) {
  try {
    const item = await fetchFirstHotPost();
    res.json(item ?? null);
  } catch {
    res.json(null);
  }
}

export async function getOnePrice(req, res) {
  try {
    const item = await fetchSimplePrice();
    res.json(item ?? null);
  } catch {
    res.json(null);
  }
}

export async function postOneInsight(req, res) {
  const { investorType = "HODL", coins = ["BTC","ETH"] } = req.body || {};
  try {
    const text = await generateInsight(investorType, coins);
    res.json({ text });
  } catch {
    res.json({ text: "Diversify, size positions wisely, and avoid over-leverage." });
  }
}

export async function getOneMeme(req, res) {
  try {
    const item = await fetchOneMeme();
    res.json(item ?? null);
  } catch {
    res.json(null);
  }
}
