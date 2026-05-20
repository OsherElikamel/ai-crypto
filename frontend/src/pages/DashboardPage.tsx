import {
  Alert,
  Box,
  Grid,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import CoinsSection from "../components/dashboard/CoinsSection.tsx";
import InsightsSection from "../components/dashboard/InsightsSection.tsx";
import MemeSection from "../components/dashboard/MemeSection.tsx";
import NewsSection from "../components/dashboard/NewsSection.tsx";
import {
  fetchCoins,
  fetchInsights,
  fetchNews,
  fetchMemes,
  submitVote,
  refreshPrices,
  refreshMeme,
} from "../services/dashboard.service.ts";
import type {
  Coin,
  Insight,
  NewsItem,
  Meme,
  VotableItem,
  ContentType,
} from "../types/index.ts";
import type { VoteStatus } from "../components/ui/VoteButtons.tsx";

function detectType(obj: VotableItem): ContentType | null {
  if ("url" in obj && typeof obj.url === "string") return "news";
  if ("coingeckoId" in obj && typeof obj.coingeckoId === "string") return "coins";
  if ("imageUrl" in obj && typeof obj.imageUrl === "string") return "memes";
  if ("text" in obj && typeof obj.text === "string") return "insights";
  return null;
}

const Dashboard = () => {
  const { user } = useAuth();
  const prefs = user?.preferences;
  const coinSymbols = useMemo(() => prefs?.coins?.length ? prefs.coins : undefined, [prefs]);
  const contentTypes = useMemo(() => new Set(prefs?.contentTypes ?? []), [prefs]);
  const showNews = !prefs || contentTypes.size === 0 || contentTypes.has("News");
  const showInsights = !prefs || contentTypes.size === 0 || contentTypes.has("Insights");
  const showMemes = !prefs || contentTypes.size === 0 || contentTypes.has("Memes");

  const [coins, setCoins] = useState<Coin[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [meme, setMeme] = useState<Meme | null>(null);

  const [voteStatuses, setVoteStatuses] = useState<Record<string, VoteStatus>>({});

  const [loading, setLoading] = useState({
    coins: true,
    insights: true,
    news: true,
    meme: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingMeme, setRefreshingMeme] = useState(false);

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
          fetchCoins(10, coinSymbols),
          showInsights ? fetchInsights(3) : Promise.resolve({ data: { items: [] } }),
          showNews ? fetchNews(8) : Promise.resolve({ data: { items: [] } }),
          showMemes ? fetchMemes(1) : Promise.resolve({ data: { items: [] } }),
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
  }, [coinSymbols, showNews, showInsights, showMemes]);

  async function handleRefreshPrices() {
    setRefreshing(true);
    try {
      await refreshPrices();
      const coinsRes = await fetchCoins(10, coinSymbols);
      setCoins(Array.isArray(coinsRes.data) ? coinsRes.data : (coinsRes.data as { items: Coin[] }).items || []);
    } catch {
      setError("Failed to refresh prices");
    } finally {
      setRefreshing(false);
    }
  }

  async function handleRefreshMeme() {
    setRefreshingMeme(true);
    try {
      const res = await refreshMeme();
      if (res.data) setMeme(res.data as Meme);
    } catch {
      setError("Failed to load new meme");
    } finally {
      setRefreshingMeme(false);
    }
  }

  async function handleVote(obj: VotableItem, action: string) {
    try {
      const type = detectType(obj);
      if (!type) return;

      const { data } = await submitVote(type, obj._id, action);
      const { likes, dislikes, status } = data;

      setVoteStatuses((prev) => ({ ...prev, [obj._id]: status || "none" }));

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
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {/* Row 1: Coins full width */}
        <Grid size={12}>
          <CoinsSection
            items={coins}
            loading={loading.coins}
            voteStatuses={voteStatuses}
            onLike={(c) => handleVote(c, "like")}
            onDislike={(c) => handleVote(c, "dislike")}
            onClear={(c) => handleVote(c, "clear")}
            onRefresh={handleRefreshPrices}
            refreshing={refreshing}
          />
        </Grid>

        {/* Row 2: News + Insights */}
        {showNews && (
          <Grid size={{ xs: 12, lg: showInsights ? 7 : 12 }}>
            <NewsSection
              items={news}
              loading={loading.news}
              voteStatuses={voteStatuses}
              onLike={(n) => handleVote(n, "like")}
              onDislike={(n) => handleVote(n, "dislike")}
              onClear={(n) => handleVote(n, "clear")}
            />
          </Grid>
        )}

        {showInsights && (
          <Grid size={{ xs: 12, lg: showNews ? 5 : 12 }}>
            <InsightsSection
              items={insights}
              loading={loading.insights}
              voteStatuses={voteStatuses}
              onLike={(i) => handleVote(i, "like")}
              onDislike={(i) => handleVote(i, "dislike")}
              onClear={(i) => handleVote(i, "clear")}
            />
          </Grid>
        )}

        {/* Row 3: Meme */}
        {showMemes && (
          <Grid size={12}>
            <MemeSection
              item={meme}
              loading={loading.meme}
              voteStatuses={voteStatuses}
              onLike={(m) => handleVote(m, "like")}
              onDislike={(m) => handleVote(m, "dislike")}
              onClear={(m) => handleVote(m, "clear")}
              onRefresh={handleRefreshMeme}
              refreshing={refreshingMeme}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Dashboard;
