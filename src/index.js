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

import apiRoutes  from "./routes/api.routes.js";
import authRoutes from "./routes/auth.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import voteRoutes from "./routes/vote.routes.js";

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

app.use("/api",  apiRoutes(app,  "/api"));
app.use("/auth", authRoutes(app, "/auth"));
app.use("/quiz", quizRoutes(app, "/quiz"));
app.use("/vote", voteRoutes(app, "/vote"));

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
