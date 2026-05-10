import axios from "axios";
import config from "../config.js";

const SUBREDDIT_URL = "https://www.reddit.com/r/CryptoCurrencyMemes/hot.json";
const USER_AGENT = "ai-crypto-dashboard/1.0";

export async function fetchOneMeme() {
  if (config.reddit.clientId && config.reddit.clientSecret) {
    return fetchWithOAuth();
  }
  return fetchPublic();
}

async function fetchPublic() {
  const { data } = await axios.get(SUBREDDIT_URL, {
    params: { limit: 10, t: "day" },
    headers: { "User-Agent": USER_AGENT },
    timeout: 8000,
  });

  const posts = data?.data?.children || [];
  const imagePost = posts.find((p) => {
    const d = p.data;
    return d && !d.stickied && (d.post_hint === "image" || d.url?.match(/\.(jpg|jpeg|png|gif|webp)/i));
  });

  const post = imagePost?.data || posts.find((p) => !p.data?.stickied)?.data;
  if (!post) return null;

  const imageUrl =
    post?.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
    post?.url_overridden_by_dest ||
    post?.url;

  return {
    id: post.id,
    title: post.title,
    permalink: `https://www.reddit.com${post.permalink}`,
    imageUrl,
  };
}

async function fetchWithOAuth() {
  const tokenRes = await axios.post(
    config.reddit.accessTokenUrl,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      auth: {
        username: config.reddit.clientId,
        password: config.reddit.clientSecret,
      },
      headers: { "User-Agent": USER_AGENT },
      timeout: 8000,
    }
  );
  const token = tokenRes.data.access_token;

  const memesUrl = config.reddit.memesUrl || "https://oauth.reddit.com/r/CryptoCurrencyMemes/hot";
  const { data } = await axios.get(memesUrl, {
    params: { t: "day", limit: 1 },
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": USER_AGENT,
    },
    timeout: 8000,
  });

  const post = data?.data?.children?.[0]?.data;
  if (!post) return null;

  const imageUrl =
    post?.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ||
    post?.url_overridden_by_dest ||
    post?.url;

  return {
    id: post.id,
    title: post.title,
    permalink: `${config.reddit.baseUrl || "https://www.reddit.com"}${post.permalink}`,
    imageUrl,
  };
}
