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

export async function fetchManyMemes() {
  const posts = await fetchPublicPosts();
  return posts.map(extractMeme).filter(Boolean);
}

function extractMeme(post) {
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

async function fetchPublicPosts() {
  const { data } = await axios.get(SUBREDDIT_URL, {
    params: { limit: 25, t: "week" },
    headers: { "User-Agent": USER_AGENT },
    timeout: 8000,
  });

  const posts = data?.data?.children || [];
  return posts
    .map((p) => p.data)
    .filter((d) => d && !d.stickied && (d.post_hint === "image" || d.url?.match(/\.(jpg|jpeg|png|gif|webp)/i)));
}

async function fetchPublic() {
  const imagePosts = await fetchPublicPosts();
  const post = imagePosts[0];
  if (!post) return null;
  return extractMeme(post);
}

async function fetchWithOAuth() {
  const tokenRes = await axios.post(
    "https://www.reddit.com/api/v1/access_token",
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

  const memesUrl = "https://oauth.reddit.com/r/CryptoCurrencyMemes/hot";
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
  return extractMeme(post);
}
