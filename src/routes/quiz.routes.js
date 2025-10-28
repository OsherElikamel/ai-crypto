const notImpl = (_req, res) => res.status(501).json({ error: "Not implemented yet" });

let registered = false;

export default function quizRoutes(app, base = "/quiz") {
  if (!registered) {
    // Later we'll add: authRequired + getQuizQuestions / submitQuizAnswers
    app.get(`${base}/questions`, notImpl);
    app.post(`${base}/answers`,  notImpl);

    registered = true;
    console.log("[routes] quiz mounted at", base);
  }
  return (_req, _res, next) => next();
}
