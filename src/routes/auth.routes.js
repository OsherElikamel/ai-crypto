const notImpl = (_req, res) =>
  res.status(501).json({ error: "Not implemented yet" });

let registered = false;

export default function authRoutes(app, base = "/auth") {
  if (!registered) {
    app.post(`${base}/register`, notImpl);
    app.post(`${base}/login`, notImpl);
    app.get(`${base}/me`, notImpl);

    registered = true;
    console.log("[routes] auth mounted at", base);
  }
  return (_req, _res, next) => next();
}
