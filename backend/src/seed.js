import Coin from "./models/Coin.js";
import Insight from "./models/Insight.js";
import NewsItem from "./models/NewsItem.js";
import Meme from "./models/Meme.js";
import Question from "./models/Questions.js";

export async function seedIfEmpty() {
  await seedQuestions();

  const coinCount = await Coin.countDocuments();
  if (coinCount > 0) return;

  console.log("Empty database detected — seeding...");

  await Coin.insertMany([
    { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
    { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
    { symbol: "SOL", name: "Solana", coingeckoId: "solana" },
    { symbol: "ADA", name: "Cardano", coingeckoId: "cardano" },
    { symbol: "AVAX", name: "Avalanche", coingeckoId: "avalanche-2" },
    { symbol: "DOT", name: "Polkadot", coingeckoId: "polkadot" },
    { symbol: "LINK", name: "Chainlink", coingeckoId: "chainlink" },
    { symbol: "POL", name: "Polygon", coingeckoId: "polygon-ecosystem-token" },
  ]);

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
    { title: "Spot Bitcoin ETFs see record weekly inflows of $2.4B", url: "https://example.com/btc-etf", source: "CoinDesk", tickers: ["BTC"] },
    { title: "Layer 2 activity surges as fees hit yearly lows", url: "https://example.com/l2", source: "The Block", tickers: ["ETH", "ARB", "OP"] },
    { title: "SEC delays decision on Solana ETF applications", url: "https://example.com/sol-etf", source: "Bloomberg", tickers: ["SOL"] },
    { title: "Cardano founder hints at major partnership announcement", url: "https://example.com/ada-partner", source: "CryptoPanic", tickers: ["ADA"] },
    { title: "Avalanche launches subnet incentive program worth $50M", url: "https://example.com/avax-subnets", source: "CoinDesk", tickers: ["AVAX"] },
    { title: "Chainlink CCIP goes live on five new chains", url: "https://example.com/link-ccip", source: "The Block", tickers: ["LINK"] },
    { title: "US Treasury proposes new crypto tax reporting rules", url: "https://example.com/tax-rules", source: "Reuters", tickers: ["BTC", "ETH"] },
    { title: "Polkadot 2.0 upgrade approved by governance vote", url: "https://example.com/dot-upgrade", source: "CryptoPanic", tickers: ["DOT"] },
  ]);

  await Meme.insertMany([
    { imageUrl: "https://picsum.photos/seed/crypto1/600/400", title: "When you sell before the pump", tags: ["btc", "funny", "relatable"], source: "r/CryptoCurrencyMemes" },
    { imageUrl: "https://picsum.photos/seed/crypto2/600/400", title: "Holding ETH since 2017", tags: ["eth", "hodl"], source: "r/CryptoCurrencyMemes" },
  ]);

  console.log("Seed complete");
}

async function seedQuestions() {
  const count = await Question.countDocuments();
  if (count > 0) return;

  await Question.insertMany([
    { id: "coins", type: "multi", question: "Which coins do you follow?", options: ["BTC", "ETH", "SOL", "ADA", "AVAX", "DOT", "LINK", "POL", "None"], order: 1, active: true },
    { id: "investorType", type: "single", question: "What best describes your style?", options: ["HODL", "DABBLER", "TRADER", "NFT_DEFI"], order: 2, active: true },
    { id: "risk", type: "single", question: "Risk tolerance?", options: ["LOW", "MEDIUM", "HIGH"], order: 3, active: true },
    { id: "contentTypes", type: "multi", question: "What content interests you?", options: ["News", "Prices", "Insights", "Memes", "None"], order: 4, active: true },
    { id: "fiat", type: "multi", question: "Preferred fiat currencies?", options: ["USD", "EUR", "GBP", "ILS", "None"], order: 5, active: true },
    { id: "depth", type: "single", question: "How detailed should insights be?", options: ["SHORT", "MEDIUM", "DEEP"], order: 6, active: true },
    { id: "alerts", type: "boolean", question: "Enable price alerts?", options: [], order: 7, active: true },
  ]);
  console.log("Quiz questions seeded");
}
