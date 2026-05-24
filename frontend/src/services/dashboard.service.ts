import api from "../utils/api.ts";
import type { Coin, Insight, Meme, NewsItem, ContentType } from "../types/index.ts";

interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}

export const fetchCoins = (limit = 10, symbols?: string[]) => {
  const params: Record<string, unknown> = { limit };
  if (symbols?.length) params.symbols = symbols.join(",");
  return api.get<PaginatedResponse<Coin>>("/coins", { params });
};

export const fetchAllCoins = () =>
  api.get<PaginatedResponse<Coin>>("/coins", { params: { limit: 100 } });

export const fetchInsights = (limit = 3, page = 1) =>
  api.get<PaginatedResponse<Insight>>("/insights", { params: { limit, page } });

export const refreshInsightsApi = () =>
  api.post<{ ok: boolean; added: number }>("/api/insights/refresh");

export const fetchNews = (limit = 8, page = 1) =>
  api.get<PaginatedResponse<NewsItem>>("/news", { params: { limit, page } });

export const fetchMemes = (limit = 1) =>
  api.get<PaginatedResponse<Meme>>("/memes", { params: { limit } });

export const submitVote = (type: ContentType, id: string, action: string) =>
  api.post<{ ok: boolean; likes: number; dislikes: number }>(`/vote/${type}/${id}`, { vote: action });

export const refreshPrices = () =>
  api.post<{ ok: boolean; updated: number }>("/api/prices/refresh");

export const refreshMeme = () =>
  api.post("/api/meme/refresh");

export const refreshNewsApi = () =>
  api.post<{ ok: boolean; added: number }>("/api/news/refresh");
