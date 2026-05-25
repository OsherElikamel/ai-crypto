export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  const message = status === 500 ? "Internal server error" : err.message;
  res.status(status).json({ error: message });
}
