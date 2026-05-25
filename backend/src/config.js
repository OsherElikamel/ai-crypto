import "dotenv/config";

const required = { MONGODB_URI: process.env.MONGODB_URI, JWT_SECRET: process.env.JWT_SECRET };
const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const config = {
  port: Number(process.env.PORT) || 8080,
  origin: process.env.ORIGIN || "http://localhost:5173",
  mongodbUri: required.MONGODB_URI,
  jwtSecret: required.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  coingecko: {
    apiKey: process.env.CG_API_KEY,
  },
  gemini: {
    key: process.env.GEMINI_KEY,
  },
};

export default config;
