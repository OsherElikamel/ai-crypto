import { getQuizQuestions, submitQuizAnswers } from "../controllers/quiz.controller.js";
import { authRequired } from "../middleware/auth.js";

let registered = false;

export default function quizRoutes(app, base = "/quiz") {
  if (!registered) {
    app.get(`${base}/questions`, authRequired, getQuizQuestions);
    app.post(`${base}/answers`,  authRequired, submitQuizAnswers);

    registered = true;
    console.log("[routes] quiz mounted at", base);
  }
  return (_req, _res, next) => next();
}
