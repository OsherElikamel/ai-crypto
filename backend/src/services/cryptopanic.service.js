import axios from "axios";
import config from "../config.js";

export async function fetchFirstHotPost() {
  const { data } = await axios.get("https://cryptopanic.com/api/v1/posts/", {
    params: {
      auth_token: config.cryptopanic.token,
      filter: "hot",
      currencies: "BTC,ETH",
      regions: "en",
      page: 1,
    },
    timeout: 6000,
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
    source: n.domain,
  };
}
