import {
  Alert,
  AppBar,
  Button,
  Grid,
  Toolbar,
  Typography,
  Box,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
import CoinsSection from "../CoinsSection/CoinsSection.tsx";
import InsightsSection from "../InsightsSection/InsightsSection.tsx";
import MemeSection from "../MemeSection/MemeSection.tsx";
import NewsSection from "../NewsSection/NewsSection.tsx";
import api from "../../utils/api.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type {
  Coin,
  Insight,
  NewsItem,
  Meme,
  VotableItem,
  ContentType,
} from "../../types/index.ts";

async function submitVote(resource: ContentType, id: string, action: string) {
  const { data } = await api.post(`/vote/${resource}/${id}`, { vote: action });
  return data as { likes: number; dislikes: number };
}

function detectType(obj: VotableItem): ContentType | null {
  if ("url" in obj && typeof obj.url === "string") return "news";
  if ("coingeckoId" in obj && typeof obj.coingeckoId === "string") return "coins";
  if ("imageUrl" in obj && typeof obj.imageUrl === "string") return "memes";
  if ("text" in obj && typeof obj.text === "string") return "insights";
  return null;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [meme, setMeme] = useState<Meme | null>(null);

  const [loading, setLoading] = useState({
    coins: true,
    insights: true,
    news: true,
    meme: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const asArray = <T,>(data: unknown): T[] => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === "object" && "items" in data && Array.isArray((data as { items: T[] }).items))
        return (data as { items: T[] }).items;
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
        setCoins(asArray<Coin>(coinsRes.data));
        setInsights(asArray<Insight>(insightsRes.data));
        setNews(asArray<NewsItem>(newsRes.data));
        const memes = asArray<Meme>(memeRes.data);
        setMeme(memes[0] || null);
      } catch (e: unknown) {
        if (!ignore) {
          const message = e instanceof Error ? e.message : "Failed to load data";
          setError(message);
        }
      } finally {
        if (!ignore)
          setLoading({ coins: false, insights: false, news: false, meme: false });
      }
    })();

    return () => { ignore = true; };
  }, []);

  async function handleVote(obj: VotableItem, action: string) {
    try {
      const type = detectType(obj);
      if (!type) return;

      const res = await submitVote(type, obj._id, action);
      const { likes, dislikes } = res;

      const applyCounts = <T extends VotableItem>(
        setter: React.Dispatch<React.SetStateAction<T[]>>
      ) => {
        setter((prev) =>
          prev.map((item) =>
            item._id === obj._id
              ? { ...item, likeCount: likes, dislikeCount: dislikes }
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
            ? { ...m, likeCount: likes, dislikeCount: dislikes }
            : m
        );
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Voting failed";
      setError(message);
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {user && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.name || user.email}
            </Typography>
          )}
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          {error && (
            <Grid size={12}>
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
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

          <Grid size={12}>
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
