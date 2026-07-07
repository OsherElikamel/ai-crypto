import { Router } from "express";
import { vote } from "../controllers/vote.controller.js";
import { authRequired } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validateId.js";

const router = Router();

router.post("/:type/:id", authRequired, validateObjectId(), vote);

export default router;
