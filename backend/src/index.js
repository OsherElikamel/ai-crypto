import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import config from "./config.js";
import connectDB from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { seedIfEmpty } from "./seed.js";
import { refreshAllPrices } from "./services/coingecko.service.js";
import { fetchAndStoreInsights } from "./controllers/insight.controller.js";
import { fetchAndStoreMeme } from "./controllers/meme.controller.js";
import { fetchAndStoreNews } from "./controllers/news.controller.js";

import apiRoutes from "./routes/api.routes.js";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import voteRoutes from "./routes/vote.routes.js";

const app = express();

const origins = config.origin.split(",").map((o) => o.trim());
app.use(cors({ origin: origins.length === 1 ? origins[0] : origins, methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], credentials: true }));
app.use(express.json({ limit: "1mb" }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-8", legacyHeaders: false });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false });

app.use(globalLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/", contentRoutes);
app.use("/api", apiRoutes);
app.use("/auth", authLimiter, authRoutes);
app.use("/quiz", quizRoutes);
app.use("/vote", voteRoutes);

app.use(errorHandler);

connectDB()
  .then(async () => {
    await seedIfEmpty();
    refreshAllPrices()
      .then((n) => console.log(`Prices refreshed for ${n} coins`))
      .catch((err) => console.warn("Price refresh failed:", err.message));

    fetchAndStoreMeme({ cleanup: true })
      .then((m) => console.log(m ? `Meme loaded: ${m.title}` : "No meme fetched"))
      .catch((err) => console.warn("Meme refresh failed:", err.message));

    fetchAndStoreNews({ cleanup: true })
      .then((n) => console.log(`News refreshed: ${n} new articles`))
      .catch((err) => console.warn("News refresh failed:", err.message));

    fetchAndStoreInsights({ cleanup: true })
      .then((n) => console.log(`Insights generated: ${n} new insights`))
      .catch((err) => console.warn("Insights generation failed:", err.message));

    app.listen(config.port, "0.0.0.0", () =>
      console.log(`Listening on ${config.port}`)
    );
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });
