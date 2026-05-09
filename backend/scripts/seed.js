import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Insight from "../src/models/Insight.js";
import NewsItem from "../src/models/NewsItem.js";
import Meme from "../src/models/Meme.js";
import Coin from "../src/models/Coin.js";
import User from "../src/models/User.js";

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected to MongoDB");

// Clean up old demo data (but keep users)
await Insight.deleteMany({});
await NewsItem.deleteMany({});
await Meme.deleteMany({});
await Coin.deleteMany({});

// Seed Insights
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

// Seed News Items
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

// Seed Memes
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

// Seed Coins
await Coin.insertMany([
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana" },
]);

// Create or update demo user
const demoEmail = "demo@example.com";
const demoPassword = "secret123";
const passwordHash = await bcrypt.hash(demoPassword, 10);

const demoPrefs = {
  coins: ["BTC", "ETH"],
  investorType: "HODL",
  risk: "MEDIUM",
  contentTypes: ["News", "Prices"],
  fiat: ["USD"],
  depth: "MEDIUM",
  alerts: true,
  avoid: [],
};

await User.findOneAndUpdate(
  { email: demoEmail },
  {
    $set: {
      name: "Demo User",
      email: demoEmail,
      passwordHash,
      onboarded: true,
      preferences: demoPrefs,
    },
  },
  { upsert: true, new: true }
);

console.log("Database seeded successfully!");
console.log("Demo user ready:");
console.log(`Email: ${demoEmail}`);
console.log(`Password: ${demoPassword}`);
process.exit(0);
