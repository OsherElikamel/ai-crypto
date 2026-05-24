import "dotenv/config";

const config = {
  port: Number(process.env.PORT) || 8080,
  origin: process.env.ORIGIN || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  coingecko: {
    apiKey: process.env.CG_API_KEY,
  },
  gemini: {
    key: process.env.GEMINI_KEY,
  },
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  },
};

export default config;
