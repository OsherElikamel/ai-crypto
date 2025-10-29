import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./db.js";

import apiRoutes from "./routes/api.routes.js";
import authRoutes from "./routes/auth.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import voteRoutes from "./routes/vote.routes.js";
import contentRoutes from "./routes/content.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use(contentRoutes(app));

app.use(apiRoutes(app));
app.use(authRoutes(app));
app.use(quizRoutes(app));
app.use(voteRoutes(app));

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
