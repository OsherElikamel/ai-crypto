import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
} from "../controllers/providers.controller.js";

import { listNews, getNewsById } from "../controllers/news.controller.js";
import { listInsights, getInsightById } from "../controllers/insight.controller.js";

let registered = false; // guard against double-registration on hot reloads

export default function apiRoutes(app, base = "/api") {
  if (!registered) {
    app.get(`${base}/news/one`,     getOneNews);
    app.get(`${base}/prices/one`,   getOnePrice);
    app.post(`${base}/insight/one`, postOneInsight);
    app.get(`${base}/meme/one`,     getOneMeme);

    // DB-backed examples 
    // app.get(`${base}/news`, listNews);
    // app.get(`${base}/news/:id`, getNewsById);
    // app.get(`${base}/insights`, listInsights);
    // app.get(`${base}/insights/:id`, getInsightById);

    registered = true;
    console.log("[routes] api mounted at", base);
  }
  // return a no-op middleware so app.use() accepts it
  return (_req, _res, next) => next();
}
