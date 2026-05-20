import { Router } from "express";
import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
  refreshPrices,
  refreshMeme,
} from "../controllers/providers.controller.js";

const router = Router();

router.get("/news/one", getOneNews);
router.get("/prices/one", getOnePrice);
router.post("/insight/one", postOneInsight);
router.get("/meme/one", getOneMeme);
router.post("/prices/refresh", refreshPrices);
router.post("/meme/refresh", refreshMeme);

export default router;
