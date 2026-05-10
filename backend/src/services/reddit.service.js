import axios from "axios";
import config from "../config.js";

export async function fetchOneMeme() {
  const tokenRes = await axios.post(
    config.reddit.accessTokenUrl,
    new URLSearchParams({ grant_type: "client_credentials" }),
    {
      auth: {
        username: config.reddit.clientId,
        password: config.reddit.clientSecret,
      },
      headers: { "User-Agent": "ai-crypto-advisor/1.0" },
      timeout: 8000,
    }
  );
  const token = tokenRes.data.access_token;

  const { data } = await axios.get(config.reddit.memesUrl, {
    params: { t: "day", limit: 1 },
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "ai-crypto-advisor/1.0",
    },
    timeout: 8000,
  });

  const post = data?.data?.children?.[0]?.data;
  if (!post) return null;

  const imageUrl =
    post?.preview?.images?.[0]?.source?.url ||
    post?.url_overridden_by_dest ||
    post?.url;

  return {
    id: post.id,
    title: post.title,
    permalink: `${config.reddit.baseUrl}${post.permalink}`,
    imageUrl,
  };
}
