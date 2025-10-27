import NewsItem from "../models/NewsItem.js";

/** GET /api/news?limit=10&page=1 */
export async function listNews(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page  = Math.max(1, Number(req.query.page) || 1);
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    NewsItem.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    NewsItem.countDocuments()
  ]);

  res.json({ page, limit, total, items });
}

/** GET /api/news/:id */
export async function getNewsById(req, res) {
  const doc = await NewsItem.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(doc);
}
