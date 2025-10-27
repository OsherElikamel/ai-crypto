import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";

import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme
} from "./controllers/providers.controller.js";

const app = express();
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/news/one",    getOneNews);
app.get("/api/prices/one",  getOnePrice);
app.post("/api/insight/one", postOneInsight);
app.get("/api/meme/one",    getOneMeme);

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });
