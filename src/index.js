import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";
import {
  listInsights,
  getInsightById,
} from "./controllers/insight.controller.js";
import { listNews, getNewsById } from "./controllers/news.controller.js";

import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
} from "./controllers/providers.controller.js";

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/news/one", getOneNews);
app.get("/api/prices/one", getOnePrice);
app.post("/api/insight/one", postOneInsight);
app.get("/api/meme/one", getOneMeme);

app.post("/auth/register", );
app.post("/auth/login", );
app.get("/auth/me", );

app.get("/quiz/questions", );
app.post("/quiz/answers/:id", );

app.post("/vote/:type/:id", );

// app.get("/api/news", listNews);
// app.get("/api/news/:id", getNewsById);
// app.get("/api/insights", listInsights);
// app.get("/api/insights/:id", getInsightById);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () =>
      console.log(`Server listening on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });
