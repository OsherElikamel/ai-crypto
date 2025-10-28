const notImpl = (_req, res) => res.status(501).json({ error: "Not implemented yet" });

let registered = false;

export default function voteRoutes(app, base = "/vote") {
  if (!registered) {
    app.post(`${base}/:type/:id`, notImpl);
    registered = true;
    console.log("[routes] vote mounted at", base);
  }
  return (_req, _res, next) => next();
}
