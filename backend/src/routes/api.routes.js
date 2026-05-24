import { Router } from "express";
import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
  refreshPrices,
  refreshMeme,
  refreshNews,
  refreshInsightsEndpoint,
} from "../controllers/providers.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/news/one", getOneNews);
router.get("/prices/one", getOnePrice);
router.post("/insight/one", postOneInsight);
router.get("/meme/one", getOneMeme);
router.post("/prices/refresh", authRequired, refreshPrices);
router.post("/meme/refresh", authRequired, refreshMeme);
router.post("/news/refresh", authRequired, refreshNews);
router.post("/insights/refresh", authRequired, refreshInsightsEndpoint);

export default router;
