import { Router } from "express";
import { vote } from "../controllers/vote.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/:type/:id", authRequired, vote);

export default router;
