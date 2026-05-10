import "dotenv/config";

const config = {
  port: Number(process.env.PORT) || 8080,
  origin: process.env.ORIGIN || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  coingecko: {
    url: process.env.COIN_GECKO_URL,
    apiKey: process.env.CG_API_KEY,
  },
  cryptopanic: {
    url: process.env.CRYPTOPANIC_URL,
    token: process.env.CRYPTOPANIC_TOKEN,
  },
  openrouter: {
    url: process.env.OPENROUTER_URL,
    key: process.env.OPENROUTER_KEY,
  },
  reddit: {
    accessTokenUrl: process.env.REDDIT_ACCESS_TOKEN,
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    memesUrl: process.env.REDDIT_CRYPTO_CURRENCY_MEMES_URL,
    baseUrl: process.env.REDDIT_BASE_URL,
  },
};

export default config;
