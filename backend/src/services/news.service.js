import axios from "axios";

const NEWS_URL = "https://data-api.coindesk.com/news/v1/article/list";

export async function fetchLatestNews(limit = 10) {
  const { data } = await axios.get(NEWS_URL, {
    params: { lang: "EN", limit },
    timeout: 8000,
  });

  const articles = data?.Data;
  if (!Array.isArray(articles)) return [];

  return articles.map((a) => ({
    sourceId: String(a.ID),
    title: a.TITLE,
    url: a.URL,
    source: a.SOURCE_DATA?.NAME || "CoinDesk",
    tickers: extractTickers(a.CATEGORY_DATA),
  }));
}

function extractTickers(categories) {
  if (!Array.isArray(categories)) return [];
  const known = new Set(["BTC", "ETH", "SOL", "ADA", "AVAX", "DOT", "LINK", "POL", "XRP", "BNB", "DOGE", "SHIB"]);
  return categories
    .map((c) => c.NAME)
    .filter((name) => known.has(name));
}

export async function fetchFirstHotPost() {
  const items = await fetchLatestNews(1);
  return items[0] || null;
}
