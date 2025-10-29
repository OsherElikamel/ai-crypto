import { listCoins, getCoinById } from "../controllers/coin.controller.js";
import { listInsights, getInsightById } from "../controllers/insight.controller.js";
import { listNews, getNewsById } from "../controllers/news.controller.js";
import { listMemes, getMemeById } from "../controllers/meme.controller.js";

let registered = false;

export default function contentRoutes(app, base = "") {
  if (!registered) {
    app.get(`${base}/coins`, listCoins);
    app.get(`${base}/coins/:id`, getCoinById);

    app.get(`${base}/insights`, listInsights);
    app.get(`${base}/insights/:id`, getInsightById);

    app.get(`${base}/news`, listNews);
    app.get(`${base}/news/:id`, getNewsById);

    app.get(`${base}/memes`, listMemes);
    app.get(`${base}/memes/:id`, getMemeById);

    registered = true;
    console.log("[routes] content mounted at", base || "/");
  }
  return (_req, _res, next) => next();
}
