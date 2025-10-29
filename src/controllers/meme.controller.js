import Meme from "../models/Meme.js";

export async function listMemes(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page = Math.max(1, Number(req.query.page) || 1);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Meme.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Meme.countDocuments(),
  ]);

  res.json({ page, limit, total, items });
}

export async function getMemeById(req, res) {
  const doc = await Meme.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(doc);
}
