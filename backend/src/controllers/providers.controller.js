import config from "../config.js";
import { fetchFirstHotPost, fetchLatestNews } from "../services/news.service.js";
import { fetchSimplePrice, refreshAllPrices } from "../services/coingecko.service.js";
import { generateInsight, generateInsights } from "../services/gemini.service.js";
import { fetchOneMeme, fetchManyMemes } from "../services/reddit.service.js";
import Meme from "../models/Meme.js";
import NewsItem from "../models/NewsItem.js";
import Insight from "../models/Insight.js";
import User from "../models/User.js";

export async function getOneNews(_req, res) {
  try {
    const item = await fetchFirstHotPost();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch news" });
  }
}

export async function getOnePrice(_req, res) {
  try {
    const item = await fetchSimplePrice();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch price from CoinGecko" });
  }
}

export async function postOneInsight(req, res) {
  const { investorType = "HODL", coins = ["BTC", "ETH"] } = req.body || {};
  try {
    const text = await generateInsight(investorType, coins);
    res.json({ text });
  } catch {
    res.status(502).json({ error: "Failed to generate insight" });
  }
}

export async function refreshInsightsEndpoint(req, res) {
  try {
    const prefs = await getUserPrefs(req.user?._id);
    const count = await fetchAndStoreInsights({ prefs });
    res.json({ ok: true, added: count });
  } catch {
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

export async function getOneMeme(_req, res) {
  try {
    const item = await fetchOneMeme();
    res.json(item ?? null);
  } catch {
    res.status(502).json({ error: "Failed to fetch meme from Reddit" });
  }
}

export async function refreshMeme(_req, res) {
  try {
    const meme = await fetchAndStoreMeme();
    res.json(meme ?? null);
  } catch {
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

export async function refreshPrices(_req, res) {
  try {
    const count = await refreshAllPrices();
    res.json({ ok: true, updated: count });
  } catch {
    res.status(502).json({ error: "Failed to refresh prices from CoinGecko" });
  }
}
