import {
  getOneNews,
  getOnePrice,
  postOneInsight,
  getOneMeme,
} from "../controllers/providers.controller.js";

let registered = false; // guard against double-registration on hot reloads

export default function apiRoutes(app, base = "/api") {
  if (!registered) {
    app.get(`${base}/news/one`, getOneNews);
    app.get(`${base}/prices/one`, getOnePrice);
    app.post(`${base}/insight/one`, postOneInsight);
    app.get(`${base}/meme/one`, getOneMeme);

    registered = true;
    console.log("[routes] api mounted at", base);
  }
  // return a no-op middleware so app.use() accepts it
  return (_req, _res, next) => next();
}
