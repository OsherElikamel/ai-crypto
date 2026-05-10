import axios from "axios";
import config from "../config.js";

export async function fetchSimplePrice() {
  const { data } = await axios.get(config.coingecko.url, {
    params: {
      ids: "bitcoin",
      vs_currencies: "usd",
      include_24hr_change: "true",
      include_last_updated_at: "true",
    },
    headers: { "x-cg-demo-api-key": config.coingecko.apiKey },
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
