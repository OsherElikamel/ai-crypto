import axios from "axios";

export async function fetchFirstHotPost() {
  const plan = process.env.CRYPTOPANIC_PLAN || "developer";
  const { data } = await axios.get(`https://cryptopanic.com/api/${plan}/v2/posts/`, {
    params: {
      auth_token: process.env.CRYPTOPANIC_TOKEN,
      filter: "hot",
      currencies: "BTC,ETH",
      regions: "en",
      page: 1
    },
    timeout: 6000
  });
  const n = data?.results?.[0];
  if (!n) return null;
  return {
    id: n.id,
    title: n.title,
    description: n.description,
    publishedAt: n.published_at,
    kind: n.kind,
    url: n.url,
    source: n.domain
  };
}
