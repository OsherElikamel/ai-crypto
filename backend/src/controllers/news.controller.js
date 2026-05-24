import NewsItem from "../models/NewsItem.js";
import { fetchLatestNews } from "../services/news.service.js";
import { sanitizeItems, sanitizeOne } from "../utils/sanitize.js";

export async function listNews(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page  = Math.max(1, Number(req.query.page) || 1);
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    NewsItem.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NewsItem.countDocuments()
  ]);

  res.json({ page, limit, total, items: sanitizeItems(items, req.user?._id) });
}

export async function getNewsById(req, res) {
  const doc = await NewsItem.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(sanitizeOne(doc, req.user?._id));
}

export async function refreshNews(_req, res) {
  try {
    const count = await fetchAndStoreNews();
    res.json({ ok: true, added: count });
  } catch {
    res.status(502).json({ error: "Failed to refresh news" });
  }
}

export async function fetchAndStoreNews({ cleanup = false } = {}) {
  if (cleanup) {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await NewsItem.deleteMany({ createdAt: { $lt: cutoff } });
  }

  const articles = await fetchLatestNews(50);
  if (!articles.length) return 0;

  const existingUrls = new Set(
    (await NewsItem.find({}, "url").lean()).map((n) => n.url)
  );

  const fresh = articles.filter((a) => !existingUrls.has(a.url));
  if (!fresh.length) return 0;

  const docs = fresh.map((a) => ({
    sourceId: a.sourceId,
    title: a.title,
    url: a.url,
    source: a.source,
    tickers: a.tickers,
  }));

  const result = await NewsItem.insertMany(docs, { ordered: false }).catch((err) => {
    if (err.code === 11000) return err.insertedDocs || [];
    throw err;
  });

  return Array.isArray(result) ? result.length : 0;
}
