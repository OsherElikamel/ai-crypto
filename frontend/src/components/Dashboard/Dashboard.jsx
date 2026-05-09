import {
  Alert,
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CoinsSection from "../CoinsSection/CoinsSection.jsx";
import InsightsSection from "../InsightsSection/InsightsSection.jsx";
import MemeSection from "../MemeSection/MemeSection.jsx";
import NewsSection from "../NewsSection/NewsSection.jsx";
import api from "../../utils/api";

async function vote(resource, id, action) {
  const { data } = await api.post(`/vote/${resource}/${id}`, { vote: action });
  return data;
}

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [insights, setInsights] = useState([]);
  const [news, setNews] = useState([]);
  const [meme, setMeme] = useState(null);

  const [loading, setLoading] = useState({
    coins: true,
    insights: true,
    news: true,
    meme: true,
  });
  const [error, setError] = useState(null);

  const resourceOf = useMemo(
    () => ({
      news: (o) => !!o && typeof o.url === "string",
      coins: (o) => !!o && typeof o.coingeckoId === "string",
      memes: (o) => !!o && typeof o.imageUrl === "string",
      insights: (o) =>
        !!o &&
        !o?.url &&
        (Array.isArray(o.tickers) || typeof o.text === "string"),
    }),
    []
  );

  useEffect(() => {
    let ignore = false;

    const asArray = (data) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.items)) return data.items;
      return [];
    };

    (async () => {
      setError(null);
      try {
        const [coinsRes, insightsRes, newsRes, memeRes] = await Promise.all([
          api.get("/coins", { params: { limit: 10 } }),
          api.get("/insights", { params: { limit: 3 } }),
          api.get("/news", { params: { limit: 8 } }),
          api.get("/memes", { params: { limit: 1 } }),
        ]);
        if (ignore) return;
        setCoins(asArray(coinsRes.data));
        setInsights(asArray(insightsRes.data));
        setNews(asArray(newsRes.data));
        const memes = asArray(memeRes.data);
        setMeme(memes[0] || null);
      } catch (e) {
        if (!ignore)
          setError(
            e?.response?.data?.message || e.message || "Failed to load data"
          );
      } finally {
        if (!ignore)
          setLoading({
            coins: false,
            insights: false,
            news: false,
            meme: false,
          });
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleVote(obj, action) {
    try {
      let type = null;
      if (resourceOf.news(obj)) type = "news";
      else if (resourceOf.coins(obj)) type = "coins";
      else if (resourceOf.memes(obj)) type = "memes";
      else if (resourceOf.insights(obj)) type = "insights";
      else return;

      const res = await vote(type, obj._id, action);
      const { likes, dislikes } = res || {};

      const applyCounts = (setter) => {
        setter((prev) =>
          prev.map((item) =>
            item._id === obj._id
              ? {
                  ...item,
                  likedBy: Array.from({
                    length: Math.max(0, Number(likes) || 0),
                  }),
                  dislikedBy: Array.from({
                    length: Math.max(0, Number(dislikes) || 0),
                  }),
                }
              : item
          )
        );
      };

      if (type === "coins") applyCounts(setCoins);
      else if (type === "insights") applyCounts(setInsights);
      else if (type === "news") applyCounts(setNews);
      else if (type === "memes") {
        setMeme((m) =>
          m && m._id === obj._id
            ? {
                ...m,
                likedBy: Array.from({
                  length: Math.max(0, Number(likes) || 0),
                }),
                dislikedBy: Array.from({
                  length: Math.max(0, Number(dislikes) || 0),
                }),
              }
            : m
        );
      }
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          e?.response?.data?.message ||
          e.message ||
          "Voting failed"
      );
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="stretch"
        >
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ minHeight: 280 }}>
              <NewsSection
                items={news}
                loading={loading.news}
                onLike={(n) => handleVote(n, "like")}
                onDislike={(n) => handleVote(n, "dislike")}
                onClear={(n) => handleVote(n, "clear")}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ minHeight: 280 }}>
              <CoinsSection
                items={coins}
                loading={loading.coins}
                onLike={(c) => handleVote(c, "like")}
                onDislike={(c) => handleVote(c, "dislike")}
                onClear={(c) => handleVote(c, "clear")}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={4}>
            <Box sx={{ minHeight: 360 }}>
              <InsightsSection
                items={insights}
                loading={loading.insights}
                onLike={(i) => handleVote(i, "like")}
                onDislike={(i) => handleVote(i, "dislike")}
                onClear={(i) => handleVote(i, "clear")}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ minHeight: { xs: 420, md: 520 } }}>
              <MemeSection
                item={meme}
                loading={loading.meme}
                onLike={(m) => handleVote(m, "like")}
                onDislike={(m) => handleVote(m, "dislike")}
                onClear={(m) => handleVote(m, "clear")}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
