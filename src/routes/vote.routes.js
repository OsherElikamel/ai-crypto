import { vote } from "../controllers/vote.controller.js";
import { authRequired } from "../middleware/auth.js";

let registered = false;

export default function voteRoutes(app, base = "/vote") {
  if (!registered) {
    app.post(`${base}/:type/:id`, authRequired, vote);

    registered = true;
    console.log("[routes] vote mounted at", base);
  }
  return (_req, _res, next) => next();
}
