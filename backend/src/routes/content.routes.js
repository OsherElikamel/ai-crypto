import { Router } from "express";
import { listCoins, getCoinById } from "../controllers/coin.controller.js";
import { listInsights, getInsightById } from "../controllers/insight.controller.js";
import { listNews, getNewsById } from "../controllers/news.controller.js";
import { listMemes, getMemeById } from "../controllers/meme.controller.js";
import { authOptional } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateId.js";

const router = Router();
const idCheck = validateObjectId();

router.get("/coins", authOptional, listCoins);
router.get("/coins/:id", idCheck, authOptional, getCoinById);

router.get("/insights", authOptional, listInsights);
router.get("/insights/:id", idCheck, authOptional, getInsightById);

router.get("/news", authOptional, listNews);
router.get("/news/:id", idCheck, authOptional, getNewsById);

router.get("/memes", authOptional, listMemes);
router.get("/memes/:id", idCheck, authOptional, getMemeById);

export default router;
