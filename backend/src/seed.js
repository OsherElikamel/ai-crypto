import Coin from "./models/Coin.js";
import Question from "./models/Questions.js";

export async function seedIfEmpty() {
  await seedQuestions();

  const coinCount = await Coin.countDocuments();
  if (coinCount > 0) return;

  console.log("Empty database detected — seeding coins...");

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
