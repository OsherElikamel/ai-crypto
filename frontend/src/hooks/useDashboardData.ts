import { useEffect, useState, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
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

export default function useDashboardData() {
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

  const showError = useCallback(
    (message: string) => setSnackbar({ open: true, message, severity: "error" }),
    [],
  );

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "info" | "error") => setSnackbar({ open: true, message, severity }),
    [],
  );

  const closeSnackbar = useCallback(() => setSnackbar((s) => ({ ...s, open: false })), []);

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
  }, [coinSymbols, showPrices, showError]);

  useEffect(() => {
    if (!showInsights) { setInsights([]); setLoading((l) => ({ ...l, insights: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, insights: true }));
    fetchInsights(3)
      .then((res) => { if (!ignore) setInsights(asArray<Insight>(res.data)); })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load insights"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, insights: false })); });
    return () => { ignore = true; };
  }, [showInsights, showError]);

  useEffect(() => {
    if (!showNews) { setNews([]); setLoading((l) => ({ ...l, news: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, news: true }));
    fetchNews(8)
      .then((res) => { if (!ignore) setNews(asArray<NewsItem>(res.data)); })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load news"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, news: false })); });
    return () => { ignore = true; };
  }, [showNews, showError]);

  useEffect(() => {
    if (!showMemes) { setMeme(null); setLoading((l) => ({ ...l, meme: false })); return; }
    let ignore = false;
    setLoading((l) => ({ ...l, meme: true }));
    fetchMemes(1)
      .then((res) => { if (!ignore) { const m = asArray<Meme>(res.data); setMeme(m[0] || null); } })
      .catch((e) => { if (!ignore) showError(e instanceof Error ? e.message : "Failed to load meme"); })
      .finally(() => { if (!ignore) setLoading((l) => ({ ...l, meme: false })); });
    return () => { ignore = true; };
  }, [showMemes, showError]);

  const handleRefreshPrices = useCallback(async () => {
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
  }, [coinSymbols, showError]);

  const handleRefreshMeme = useCallback(async () => {
    setRefreshingMeme(true);
    try {
      const res = await refreshMeme();
      if (res.data) setMeme(res.data as Meme);
    } catch {
      showError("Failed to load new meme");
    } finally {
      setRefreshingMeme(false);
    }
  }, [showError]);

  const handleRefreshNews = useCallback(async () => {
    setRefreshingNews(true);
    try {
      const nextPage = newsPage + 1;
      const newsRes = await fetchNews(8, nextPage);
      const items = asArray<NewsItem>(newsRes.data);

      if (items.length > 0) {
        setNews(items);
        setNewsPage(nextPage);
        showSnackbar("Showing next batch of articles", "success");
      } else {
        const refreshRes = await refreshNewsApi();
        const added = refreshRes.data?.added ?? 0;
        const freshRes = await fetchNews(8, 1);
        setNews(asArray<NewsItem>(freshRes.data));
        setNewsPage(1);
        showSnackbar(
          added > 0 ? `${added} new articles fetched` : "No new articles right now — check back later",
          added > 0 ? "success" : "info",
        );
      }
    } catch {
      showError("Failed to refresh news");
    } finally {
      setRefreshingNews(false);
    }
  }, [newsPage, showError, showSnackbar]);

  const handleRefreshInsights = useCallback(async () => {
    setRefreshingInsights(true);
    try {
      const refreshRes = await refreshInsightsApi();
      const added = refreshRes.data?.added ?? 0;
      const insightsRes = await fetchInsights(3);
      setInsights(asArray<Insight>(insightsRes.data));
      showSnackbar(
        added > 0 ? `${added} new insights generated` : "Could not generate insights right now",
        added > 0 ? "success" : "info",
      );
    } catch {
      showError("Failed to generate insights");
    } finally {
      setRefreshingInsights(false);
    }
  }, [showError, showSnackbar]);

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
  }, [prefs, refreshUser, showError]);

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
  }, [contentTypes, refreshUser, showError]);

  const handleVote = useCallback(async (obj: VotableItem, action: string) => {
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
      showError(e instanceof Error ? e.message : "Voting failed");
    }
  }, [showError]);

  return {
    coins,
    allCoins,
    insights,
    news,
    meme,
    loading,
    refreshing,
    refreshingMeme,
    refreshingNews,
    refreshingInsights,
    snackbar,
    closeSnackbar,
    showPrices,
    showNews,
    showInsights,
    showMemes,
    contentTypes,
    selectedCoinSymbols: prefs?.coins ?? [],
    handleRefreshPrices,
    handleRefreshMeme,
    handleRefreshNews,
    handleRefreshInsights,
    handleToggleCoin,
    handleToggleSection,
    handleVote,
  };
}
