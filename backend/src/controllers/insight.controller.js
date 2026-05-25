import config from "../config.js";
import Insight from "../models/Insight.js";
import User from "../models/User.js";
import { generateInsights } from "../services/gemini.service.js";
import { sanitizeItems, sanitizeOne } from "../utils/sanitize.js";

export async function listInsights(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page  = Math.max(1, Number(req.query.page) || 1);
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Insight.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Insight.countDocuments()
  ]);

  res.json({ page, limit, total, items: sanitizeItems(items, req.user?._id) });
}

export async function getInsightById(req, res) {
  const doc = await Insight.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(sanitizeOne(doc, req.user?._id));
}

export async function refreshInsightsEndpoint(req, res) {
  try {
    const prefs = await getUserPrefs(req.user?._id);
    const count = await fetchAndStoreInsights({ prefs });
    res.json({ ok: true, added: count });
  } catch (err) {
    console.error("Insights refresh failed:", err);
    res.status(502).json({ error: "Failed to generate insights" });
  }
}

export async function fetchAndStoreInsights({ cleanup = false, prefs = null } = {}) {
  if (!config.gemini.key) return 0;

  if (cleanup) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Insight.deleteMany({ createdAt: { $lt: cutoff } });
  }

  const items = await generateInsights(3, {
    coins: prefs?.coins,
    investorType: prefs?.investorType,
    risk: prefs?.risk,
    depth: prefs?.depth,
  });
  if (!items.length) return 0;

  const docs = items.map((i) => ({
    title: i.title,
    text: i.text,
    tags: i.tags || [],
    tickers: i.tickers || [],
  }));

  const result = await Insight.insertMany(docs);
  return result.length;
}

async function getUserPrefs(userId) {
  if (!userId) return null;
  const user = await User.findById(userId, "preferences").lean();
  return user?.preferences || null;
}
