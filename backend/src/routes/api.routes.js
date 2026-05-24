import { Router } from "express";
import { refreshPrices } from "../controllers/coin.controller.js";
import { refreshInsightsEndpoint } from "../controllers/insight.controller.js";
import { refreshMeme } from "../controllers/meme.controller.js";
import { refreshNews } from "../controllers/news.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/prices/refresh", authRequired, refreshPrices);
router.post("/meme/refresh", authRequired, refreshMeme);
router.post("/news/refresh", authRequired, refreshNews);
router.post("/insights/refresh", authRequired, refreshInsightsEndpoint);

export default router;
