import { Router } from "express";
import { register, login, me, updatePreferences } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);
router.patch("/preferences", authRequired, updatePreferences);

export default router;
