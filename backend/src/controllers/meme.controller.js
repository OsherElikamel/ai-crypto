import Meme from "../models/Meme.js";
import { fetchManyMemes } from "../services/reddit.service.js";
import { sanitizeItems, sanitizeOne } from "../utils/sanitize.js";

export async function listMemes(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page = Math.max(1, Number(req.query.page) || 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Meme.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Meme.countDocuments(),
  ]);

  res.json({ page, limit, total, items: sanitizeItems(items, req.user?._id) });
}

export async function getMemeById(req, res) {
  const doc = await Meme.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(sanitizeOne(doc, req.user?._id));
}

export async function refreshMeme(req, res) {
  try {
    const doc = await fetchAndStoreMeme();
    const sanitized = doc ? sanitizeOne(doc.toObject(), req.user?._id) : null;
    res.json(sanitized);
  } catch (err) {
    console.error("Meme refresh failed:", err);
    res.status(502).json({ error: "Failed to refresh meme from Reddit" });
  }
}

export async function fetchAndStoreMeme({ cleanup = false } = {}) {
  if (cleanup) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Meme.deleteMany({ createdAt: { $lt: cutoff } });
  }

  const items = await fetchManyMemes();
  if (!items.length) return null;

  const existingTitles = new Set(
    (await Meme.find({ source: "reddit" }, "title").lean()).map((m) => m.title)
  );

  const fresh = items.filter((m) => m.imageUrl && !existingTitles.has(m.title));
  const pick = fresh.length > 0
    ? fresh[Math.floor(Math.random() * fresh.length)]
    : items[Math.floor(Math.random() * items.length)];

  const doc = await Meme.findOneAndUpdate(
    { source: "reddit", title: pick.title },
    {
      $setOnInsert: {
        imageUrl: pick.imageUrl,
        title: pick.title,
        tags: ["crypto", "meme"],
        source: "reddit",
      },
    },
    { upsert: true, new: true }
  );
  return doc;
}
