import Coin from "../models/Coin.js";

export async function listCoins(req, res) {
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const page  = Math.max(1, Number(req.query.page) || 1);
  const skip  = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Coin.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Coin.countDocuments()
  ]);

  res.json({ page, limit, total, items });
}

export async function getCoinById(req, res) {
  const doc = await Coin.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "not found" });
  res.json(doc);
}
