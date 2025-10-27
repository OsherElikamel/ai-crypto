import "dotenv/config";
import mongoose from "mongoose";
import Insight from "../src/models/Insight.js";
import NewsItem from "../src/models/NewsItem.js";
import Meme from "../src/models/Meme.js";
import Coin from "../src/models/Coin.js";

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected to MongoDB");

await Insight.deleteMany({});
await NewsItem.deleteMany({});
await Meme.deleteMany({});
await Coin.deleteMany({});

await Insight.insertMany([
  {
    title: "Bitcoin Dominance Rises",
    text: "Bitcoin market share is increasing as altcoins slow down.",
    tickers: ["BTC"],
  },
  {
    title: "Ethereum Fees Drop",
    text: "ETH gas fees are falling, increasing user activity.",
    tickers: ["ETH"],
  },
]);

await NewsItem.insertMany([
  {
    title: "Spot Bitcoin ETFs see inflows",
    url: "https://example.com/btc-etf",
    source: "CryptoNews",
    tickers: ["BTC"],
  },
  {
    title: "Layer 2 activity surges",
    url: "https://example.com/l2",
    source: "CryptoNews",
    tickers: ["ETH"],
  },
]);

await Meme.insertMany([
  {
    imageUrl: "https://picsum.photos/seed/crypto1/600/400",
    title: "When you sell before the pump",
    tags: ["btc", "funny"],
  },
  {
    imageUrl: "https://picsum.photos/seed/crypto2/600/400",
    title: "Holding ETH since 2017",
    tags: ["eth", "relatable"],
  },
]);

await Coin.insertMany([
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana" },
]);

console.log("Database seeded successfully!");
process.exit(0);
