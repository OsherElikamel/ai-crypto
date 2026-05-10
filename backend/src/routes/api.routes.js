import { Router } from "express";
import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
} from "../controllers/providers.controller.js";

const router = Router();

router.get("/news/one", getOneNews);
router.get("/prices/one", getOnePrice);
router.post("/insight/one", postOneInsight);
router.get("/meme/one", getOneMeme);

export default router;
