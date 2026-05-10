import { Router } from "express";
import { listCoins, getCoinById } from "../controllers/coin.controller.js";
import { listInsights, getInsightById } from "../controllers/insight.controller.js";
import { listNews, getNewsById } from "../controllers/news.controller.js";
import { listMemes, getMemeById } from "../controllers/meme.controller.js";

const router = Router();

router.get("/coins", listCoins);
router.get("/coins/:id", getCoinById);

router.get("/insights", listInsights);
router.get("/insights/:id", getInsightById);

router.get("/news", listNews);
router.get("/news/:id", getNewsById);

router.get("/memes", listMemes);
router.get("/memes/:id", getMemeById);

export default router;
