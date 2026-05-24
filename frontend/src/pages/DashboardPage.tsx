import {
  Alert,
  Box,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import CoinsSection from "../components/dashboard/CoinsSection.tsx";
import InsightsSection from "../components/dashboard/InsightsSection.tsx";
import MemeSection from "../components/dashboard/MemeSection.tsx";
import NewsSection from "../components/dashboard/NewsSection.tsx";
import AddCoinDialog from "../components/dashboard/AddCoinDialog.tsx";
import SectionSettingsDialog from "../components/dashboard/SectionSettingsDialog.tsx";
import {
  fetchCoins,
  fetchAllCoins,
  fetchInsights,
  fetchNews,
  fetchMemes,
  submitVote,
  refreshPrices,
  refreshMeme,
  refreshNewsApi,
  refreshInsightsApi,
} from "../services/dashboard.service.ts";
import { updatePreferences } from "../services/auth.service.ts";
import type {
  Coin,
  Insight,
  NewsItem,
  Meme,
  VotableItem,
  ContentType,
} from "../types/index.ts";

function detectType(obj: VotableItem): ContentType | null {
  if ("url" in obj && typeof obj.url === "string") return "news";
  if ("coingeckoId" in obj && typeof obj.coingeckoId === "string") return "coins";
  if ("imageUrl" in obj && typeof obj.imageUrl === "string") return "memes";
  if ("text" in obj && typeof obj.text === "string") return "insights";
  return null;
}

const asArray = <T,>(data: unknown): T[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "items" in data && Array.isArray((data as { items: T[] }).items))
    return (data as { items: T[] }).items;
  return [];
};

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const prefs = user?.preferences;
  const coinSymbols = useMemo(() => prefs?.coins?.length ? prefs.coins : undefined, [prefs]);
  const contentTypes = useMemo(() => prefs?.contentTypes ?? [], [prefs]);
  const contentSet = useMemo(() => new Set(contentTypes), [contentTypes]);
  const showPrices = !prefs || contentSet.size === 0 || contentSet.has("Prices");
  const showNews = !prefs || contentSet.size === 0 || contentSet.has("News");
  const showInsights = !prefs || contentSet.size === 0 || contentSet.has("Insights");
  const showMemes = !prefs || contentSet.size === 0 || contentSet.has("Memes");

  const [coins, setCoins] = useState<Coin[]>([]);
  const [allCoins, setAllCoins] = useState<{ symbol: string; name: string }[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [meme, setMeme] = useState<Meme | null>(null);

  const [loading, setLoading] = useState({
    coins: true,
    insights: true,
    news: true,
    meme: true,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingMeme, setRefreshingMeme] = useState(false);
  const [refreshingNews, setRefreshingNews] = useState(false);
  const [newsPage, setNewsPage] = useState(1);
  const [refreshingInsights, setRefreshingInsights] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "info" | "error" }>({ open: false, message: "", severity: "info" });
  const showError = (message: string) => setSnackbar({ open: true, message, severity: "error" });
  const [coinDialogOpen, setCoinDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    fetchAllCoins().then((res) => {
      setAllCoins(asArray<Coin>(res.data).map((c) => ({ symbol: c.symbol, name: c.name })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!showPrices) { setCoins([]); setLoading((l) => ({ ...l, coins: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, coins: true }));
    fetchCoins(10, coinSymbols)
      .then((res) => { if (!ignore) setCoins(asArray<Coin>(res.data)); })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load prices"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, coins: false })); });
    return () => { ignore = true; };
  }, [coinSymbols, showPrices]);

  useEffect(() => {
    if (!showInsights) { setInsights([]); setLoading((l) => ({ ...l, insights: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, insights: true }));
    fetchInsights(3)
      .then((res) => { if (!ignore) setInsights(asArray<Insight>(res.data)); })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load insights"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, insights: false })); });
    return () => { ignore = true; };
  }, [showInsights]);

  useEffect(() => {
    if (!showNews) { setNews([]); setLoading((l) => ({ ...l, news: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, news: true }));
    fetchNews(8)
      .then((res) => { if (!ignore) setNews(asArray<NewsItem>(res.data)); })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load news"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, news: false })); });
    return () => { ignore = true; };
  }, [showNews]);

  useEffect(() => {
    if (!showMemes) { setMeme(null); setLoading((l) => ({ ...l, meme: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, meme: true }));
    fetchMemes(1)
      .then((res) => { if (!ignore) { const m = asArray<Meme>(res.data); setMeme(m[0] || null); } })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load meme"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, meme: false })); });
    return () => { ignore = true; };
  }, [showMemes]);

  async function handleRefreshPrices() {
    setRefreshing(true);
    try {
      await refreshPrices();
      const coinsRes = await fetchCoins(10, coinSymbols);
      setCoins(asArray<Coin>(coinsRes.data));
    } catch {
      showError("Failed to refresh prices");
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
      showError("Failed to load new meme");
    } finally {
      setRefreshingMeme(false);
    }
  }

  async function handleRefreshNews() {
    setRefreshingNews(true);
    try {
      const nextPage = newsPage + 1;
      const newsRes = await fetchNews(8, nextPage);
      const items = asArray<NewsItem>(newsRes.data);

      if (items.length > 0) {
        setNews(items);
        setNewsPage(nextPage);
        setSnackbar({ open: true, message: "Showing next batch of articles", severity: "success" });
      } else {
        const refreshRes = await refreshNewsApi();
        const added = refreshRes.data?.added ?? 0;
        const freshRes = await fetchNews(8, 1);
        setNews(asArray<NewsItem>(freshRes.data));
        setNewsPage(1);
        setSnackbar({
          open: true,
          message: added > 0 ? `${added} new articles fetched` : "No new articles right now — check back later",
          severity: added > 0 ? "success" : "info",
        });
      }
    } catch {
      showError("Failed to refresh news");
    } finally {
      setRefreshingNews(false);
    }
  }

  async function handleRefreshInsights() {
    setRefreshingInsights(true);
    try {
      const refreshRes = await refreshInsightsApi();
      const added = refreshRes.data?.added ?? 0;
      const insightsRes = await fetchInsights(3);
      setInsights(asArray<Insight>(insightsRes.data));
      setSnackbar({
        open: true,
        message: added > 0 ? `${added} new insights generated` : "Could not generate insights right now",
        severity: added > 0 ? "success" : "info",
      });
    } catch {
      showError("Failed to generate insights");
    } finally {
      setRefreshingInsights(false);
    }
  }

  const handleToggleCoin = useCallback(async (symbol: string) => {
    const current = prefs?.coins ?? [];
    const updated = current.includes(symbol)
      ? current.filter((s) => s !== symbol)
      : [...current, symbol];
    try {
      await updatePreferences({ coins: updated });
      await refreshUser();
    } catch {
      showError("Failed to update coin preferences");
    }
  }, [prefs, refreshUser]);

  const handleToggleSection = useCallback(async (type: string) => {
    const current = contentTypes.length > 0 ? [...contentTypes] : ["Prices", "News", "Insights", "Memes"];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    try {
      await updatePreferences({ contentTypes: updated });
      await refreshUser();
    } catch {
      showError("Failed to update section preferences");
    }
  }, [contentTypes, refreshUser]);

  async function handleVote(obj: VotableItem, action: string) {
    try {
      const type = detectType(obj);
      if (!type) return;

      const { data } = await submitVote(type, obj._id, action);
      const { likes, dislikes, status } = data;

      const patch = { likeCount: likes, dislikeCount: dislikes, voteStatus: status || ("none" as const) };

      const applyPatch = <T extends VotableItem>(
        setter: React.Dispatch<React.SetStateAction<T[]>>
      ) => {
        setter((prev) =>
          prev.map((item) =>
            item._id === obj._id ? { ...item, ...patch } : item
          )
        );
      };

      if (type === "coins") applyPatch(setCoins);
      else if (type === "insights") applyPatch(setInsights);
      else if (type === "news") applyPatch(setNews);
      else if (type === "memes") {
        setMeme((m) =>
          m && m._id === obj._id ? { ...m, ...patch } : m
        );
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Voting failed";
      showError(message);
    }
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 2, md: 4 }, py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 1 }}>
        <Tooltip title="Dashboard settings">
          <IconButton onClick={() => setSettingsOpen(true)} size="small">
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Grid container spacing={2.5}>
        {showPrices && (
          <Grid size={12}>
            <CoinsSection
              items={coins}
              loading={loading.coins}
              onLike={(c) => handleVote(c, "like")}
              onDislike={(c) => handleVote(c, "dislike")}
              onClear={(c) => handleVote(c, "clear")}
              onRefresh={handleRefreshPrices}
              refreshing={refreshing}
              onAddCoin={() => setCoinDialogOpen(true)}
            />
          </Grid>
        )}

        {showNews && (
          <Grid size={{ xs: 12, lg: showInsights ? 7 : 12 }}>
            <NewsSection
              items={news}
              loading={loading.news}
              onLike={(n) => handleVote(n, "like")}
              onDislike={(n) => handleVote(n, "dislike")}
              onClear={(n) => handleVote(n, "clear")}
              onRefresh={handleRefreshNews}
              refreshing={refreshingNews}
            />
          </Grid>
        )}

        {showInsights && (
          <Grid size={{ xs: 12, lg: showNews ? 5 : 12 }}>
            <InsightsSection
              items={insights}
              loading={loading.insights}
              onLike={(i) => handleVote(i, "like")}
              onDislike={(i) => handleVote(i, "dislike")}
              onClear={(i) => handleVote(i, "clear")}
              onRefresh={handleRefreshInsights}
              refreshing={refreshingInsights}
            />
          </Grid>
        )}

        {showMemes && (
          <Grid size={12}>
            <MemeSection
              item={meme}
              loading={loading.meme}
              onLike={(m) => handleVote(m, "like")}
              onDislike={(m) => handleVote(m, "dislike")}
              onClear={(m) => handleVote(m, "clear")}
              onRefresh={handleRefreshMeme}
              refreshing={refreshingMeme}
            />
          </Grid>
        )}
      </Grid>

      <AddCoinDialog
        open={coinDialogOpen}
        onClose={() => setCoinDialogOpen(false)}
        allCoins={allCoins}
        selectedSymbols={prefs?.coins ?? []}
        onToggle={handleToggleCoin}
      />

      <SectionSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTypes={contentTypes.length > 0 ? contentTypes : ["Prices", "News", "Insights", "Memes"]}
        onToggle={handleToggleSection}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
