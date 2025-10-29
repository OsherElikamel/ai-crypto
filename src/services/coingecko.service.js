import axios from "axios";
import "dotenv/config";

export async function fetchSimplePrice() {
  const { data } = await axios.get(process.env.COIN_GECKO_URL, {
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
