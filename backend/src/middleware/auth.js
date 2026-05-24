import jwt from "jsonwebtoken";
import config from "../config.js";

export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing token" });
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function authOptional(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) req.user = jwt.verify(token, config.jwtSecret);
  } catch { /* ignore — user stays null */ }
  next();
}
