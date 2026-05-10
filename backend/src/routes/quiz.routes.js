import { Router } from "express";
import { getQuizQuestions, submitQuizAnswers } from "../controllers/quiz.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/questions", authRequired, getQuizQuestions);
router.post("/answers", authRequired, submitQuizAnswers);

export default router;
