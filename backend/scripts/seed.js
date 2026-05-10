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

await Insight.deleteMany({});
await NewsItem.deleteMany({});
await Meme.deleteMany({});
await Coin.deleteMany({});

await Insight.insertMany([
  {
    title: "Bitcoin Dominance Rises",
    text: "Bitcoin market share is increasing as altcoins slow down. Historically, rising BTC dominance signals a flight to safety within crypto — traders may be de-risking ahead of macro uncertainty.",
    tickers: ["BTC"],
    tags: ["dominance", "macro"],
  },
  {
    title: "Ethereum Fees Drop",
    text: "ETH gas fees are falling sharply, driving increased DeFi and NFT activity. Lower fees make L1 viable for smaller transactions again, potentially pulling volume back from L2s.",
    tickers: ["ETH"],
    tags: ["gas", "defi"],
  },
  {
    title: "Solana DeFi TVL Surge",
    text: "Solana's total value locked has surged 40% this month as new lending protocols launch. The ecosystem is maturing fast, drawing institutional interest alongside retail traders.",
    tickers: ["SOL"],
    tags: ["tvl", "defi", "growth"],
  },
]);

await NewsItem.insertMany([
  {
    title: "Spot Bitcoin ETFs see record weekly inflows of $2.4B",
    url: "https://example.com/btc-etf",
    source: "CoinDesk",
    tickers: ["BTC"],
  },
  {
    title: "Layer 2 activity surges as fees hit yearly lows",
    url: "https://example.com/l2",
    source: "The Block",
    tickers: ["ETH", "ARB", "OP"],
  },
  {
    title: "SEC delays decision on Solana ETF applications",
    url: "https://example.com/sol-etf",
    source: "Bloomberg",
    tickers: ["SOL"],
  },
  {
    title: "Cardano founder hints at major partnership announcement",
    url: "https://example.com/ada-partner",
    source: "CryptoPanic",
    tickers: ["ADA"],
  },
  {
    title: "Avalanche launches subnet incentive program worth $50M",
    url: "https://example.com/avax-subnets",
    source: "CoinDesk",
    tickers: ["AVAX"],
  },
  {
    title: "Chainlink CCIP goes live on five new chains",
    url: "https://example.com/link-ccip",
    source: "The Block",
    tickers: ["LINK"],
  },
  {
    title: "US Treasury proposes new crypto tax reporting rules",
    url: "https://example.com/tax-rules",
    source: "Reuters",
    tickers: ["BTC", "ETH"],
  },
  {
    title: "Polkadot 2.0 upgrade approved by governance vote",
    url: "https://example.com/dot-upgrade",
    source: "CryptoPanic",
    tickers: ["DOT"],
  },
]);

await Meme.insertMany([
  {
    imageUrl: "https://picsum.photos/seed/crypto1/600/400",
    title: "When you sell before the pump",
    tags: ["btc", "funny", "relatable"],
    source: "r/CryptoCurrencyMemes",
  },
  {
    imageUrl: "https://picsum.photos/seed/crypto2/600/400",
    title: "Holding ETH since 2017",
    tags: ["eth", "hodl"],
    source: "r/CryptoCurrencyMemes",
  },
]);

await Coin.insertMany([
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana" },
  { symbol: "ADA", name: "Cardano", coingeckoId: "cardano" },
  { symbol: "AVAX", name: "Avalanche", coingeckoId: "avalanche-2" },
  { symbol: "DOT", name: "Polkadot", coingeckoId: "polkadot" },
  { symbol: "LINK", name: "Chainlink", coingeckoId: "chainlink" },
  { symbol: "MATIC", name: "Polygon", coingeckoId: "matic-network" },
]);

const demoEmail = "demo@example.com";
const demoPassword = "secret123";
const passwordHash = await bcrypt.hash(demoPassword, 10);

const demoPrefs = {
  coins: ["BTC", "ETH", "SOL"],
  investorType: "HODL",
  risk: "MEDIUM",
  contentTypes: ["News", "Prices", "Insights"],
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
