import Insight from "../models/Insight.js";
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
