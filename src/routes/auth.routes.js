import { register, login, me } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

let registered = false;

export default function authRoutes(app, base = "/auth") {
  if (!registered) {
    app.post(`${base}/register`, register);
    app.post(`${base}/login`,    login);
    app.get(`${base}/me`,        authRequired, me);

    registered = true;
    console.log("[routes] auth mounted at", base);
  }
  return (_req, _res, next) => next();
}
