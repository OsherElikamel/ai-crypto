import axios from "axios";
import config from "../config.js";
import Coin from "../models/Coin.js";

const MARKETS_URL = "https://api.coingecko.com/api/v3/coins/markets";

function headers() {
  const h = {};
  if (config.coingecko.apiKey) h["x-cg-demo-api-key"] = config.coingecko.apiKey;
  return h;
}

export async function refreshAllPrices() {
  const coins = await Coin.find({}, "coingeckoId");
  if (!coins.length) return 0;

  const ids = coins.map((c) => c.coingeckoId).join(",");

  const { data } = await axios.get(MARKETS_URL, {
    params: {
      vs_currency: "usd",
      ids,
      order: "market_cap_desc",
      per_page: coins.length,
      page: 1,
    },
    headers: headers(),
    timeout: 10000,
  });

  if (!Array.isArray(data)) return 0;

  const byId = Object.fromEntries(data.map((d) => [d.id, d]));
  const now = new Date();

  const ops = coins
    .filter((c) => byId[c.coingeckoId])
    .map((c) => {
      const d = byId[c.coingeckoId];
      return {
        updateOne: {
          filter: { _id: c._id },
          update: {
            $set: {
              price: d.current_price ?? null,
              change24h: d.price_change_percentage_24h ?? null,
              marketCap: d.market_cap ?? null,
              volume24h: d.total_volume ?? null,
              rank: d.market_cap_rank ?? null,
              priceUpdatedAt: now,
            },
          },
        },
      };
    });

  if (ops.length) await Coin.bulkWrite(ops);
  return ops.length;
}
