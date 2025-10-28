import Insight from "../models/Insight.js";
import NewsItem from "../models/NewsItem.js";
import Meme from "../models/Meme.js";
import Coin from "../models/Coin.js";
import { voteOnDoc } from "../services/vote.service.js";

const MODEL_MAP = {
  insights: Insight,
  news: NewsItem,
  memes: Meme,
  coins: Coin,
};

export async function vote(req, res) {
  try {
    const { type, id } = req.params;
    const { vote: action } = req.body || {};
    const Model = MODEL_MAP[type];
    if (!Model) return res.status(400).json({ error: "invalid type" });
    if (!id) return res.status(400).json({ error: "missing id" });
    if (!action) return res.status(400).json({ error: "missing vote" });

    const result = await voteOnDoc(Model, id, req.user._id, action);
    return res.json({ ok: true, ...result });
  } catch (err) {
    const code = err.status || 500;
    return res.status(code).json({ error: err.message || "internal error" });
  }
}

