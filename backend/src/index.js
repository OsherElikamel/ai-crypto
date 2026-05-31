import app from "./app.js";
import config from "./config.js";
import connectDB from "./db.js";
import { seedIfEmpty } from "./seed.js";
import { refreshAllPrices } from "./services/coingecko.service.js";
import { fetchAndStoreInsights } from "./controllers/insight.controller.js";
import { fetchAndStoreMeme } from "./controllers/meme.controller.js";
import { fetchAndStoreNews } from "./controllers/news.controller.js";

connectDB()
  .then(async () => {
    await seedIfEmpty();
    refreshAllPrices()
      .then((n) => console.log(`Prices refreshed for ${n} coins`))
      .catch((err) => console.warn("Price refresh failed:", err.message));

    fetchAndStoreMeme({ cleanup: true })
      .then((m) => console.log(m ? `Meme loaded: ${m.title}` : "No meme fetched"))
      .catch((err) => console.warn("Meme refresh failed:", err.message));

    fetchAndStoreNews({ cleanup: true })
      .then((n) => console.log(`News refreshed: ${n} new articles`))
      .catch((err) => console.warn("News refresh failed:", err.message));

    fetchAndStoreInsights({ cleanup: true })
      .then((n) => console.log(`Insights generated: ${n} new insights`))
      .catch((err) => console.warn("Insights generation failed:", err.message));

    app.listen(config.port, "0.0.0.0", () =>
      console.log(`Listening on ${config.port}`)
    );
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);
  });
