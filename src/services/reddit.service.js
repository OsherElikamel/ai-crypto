import axios from "axios";
import "dotenv/config";

export async function fetchOneMeme() {
  const tokenRes = await axios.post(
    process.env.REDDIT_ACCESS_TOKEN,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      auth: { username: process.env.REDDIT_CLIENT_ID, password: process.env.REDDIT_CLIENT_SECRET },
      headers: { "User-Agent": "ai-crypto-advisor/1.0 (by u/yourusername)" },
      timeout: 8000
    }
  );
  const token = tokenRes.data.access_token;

  const { data } = await axios.get(process.env.REDDIT_CRYPTO_CURRENCY_MEMES_URL, {
    params: { t: "day", limit: 1 },
    headers: { Authorization: `Bearer ${token}`, "User-Agent": "ai-crypto-advisor/1.0 (by u/yourusername)" },
    timeout: 8000
  });

  const post = data?.data?.children?.[0]?.data;
  if (!post) return null;

  const imageUrl = post?.preview?.images?.[0]?.source?.url
    || post?.url_overridden_by_dest
    || post?.url;

  return {
    id: post.id,
    title: post.title,
    permalink: `${process.env.REDDIT_BASE_URL}${post.permalink}`,
    imageUrl
  };
}
