import axios from "axios";
import config from "../config.js";

const BASE_URL = config.coingecko.url || "https://api.coingecko.com/api/v3/simple/price";

export async function fetchSimplePrice() {
  const headers = {};
  if (config.coingecko.apiKey) {
    headers["x-cg-demo-api-key"] = config.coingecko.apiKey;
  }

  const { data } = await axios.get(BASE_URL, {
    params: {
      ids: "bitcoin",
      vs_currencies: "usd",
      include_24hr_change: "true",
      include_last_updated_at: "true",
    },
    headers,
    timeout: 6000,
  });

  const v = data?.bitcoin;
  if (!v) return null;
  return {
    id: "bitcoin",
    price: v.usd,
    change24h: v.usd_24h_change,
    lastUpdatedAt: v.last_updated_at,
  };
}
