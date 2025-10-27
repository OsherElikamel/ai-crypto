import axios from "axios";

export async function fetchSimplePrice() {
  const { data } = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
    params: {
      ids: "bitcoin",
      vs_currencies: "usd",
      include_24hr_change: "true",
      include_last_updated_at: "true"
    },
    headers: { "x-cg-demo-api-key": process.env.CG_API_KEY },
    timeout: 6000
  });

  const v = data?.bitcoin;
  if (!v) return null;
  return {
    id: "bitcoin",
    price: v.usd,
    change24h: v.usd_24h_change,
    lastUpdatedAt: v.last_updated_at
  };
}
