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

export const fetchInsights = (limit = 3) =>
  api.get<PaginatedResponse<Insight>>("/insights", { params: { limit } });

export const fetchNews = (limit = 8) =>
  api.get<PaginatedResponse<NewsItem>>("/news", { params: { limit } });

export const fetchMemes = (limit = 1) =>
  api.get<PaginatedResponse<Meme>>("/memes", { params: { limit } });

export const submitVote = (type: ContentType, id: string, action: string) =>
  api.post<{ ok: boolean; likes: number; dislikes: number }>(`/vote/${type}/${id}`, { vote: action });

export const refreshPrices = () =>
  api.post<{ ok: boolean; updated: number }>("/api/prices/refresh");

export const refreshMeme = () =>
  api.post("/api/meme/refresh");
