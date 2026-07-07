import Insight from "../models/Insight.js";
import NewsItem from "../models/NewsItem.js";
import Meme from "../models/Meme.js";
import Coin from "../models/Coin.js";
import { castVote } from "../services/vote.service.js";

const MODEL_MAP = {
  insights: Insight,
  news: NewsItem,
  memes: Meme,
  coins: Coin,
};

export async function vote(req, res) {
  const { type, id } = req.params;
  const { vote: action } = req.body || {};
  const Model = MODEL_MAP[type];
  if (!Model) return res.status(400).json({ error: "invalid type" });
  if (!action) return res.status(400).json({ error: "missing vote" });

  // castVote throws errors carrying a .status — the global error
  // handler returns those messages as-is and hides real 500 details.
  const result = await castVote(type, Model, id, req.user._id, action);
  return res.json({ ok: true, ...result });
}

