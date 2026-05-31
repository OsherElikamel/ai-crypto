import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import config from "./config.js";
import { errorHandler } from "./middleware/errorHandler.js";

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

export default app;
