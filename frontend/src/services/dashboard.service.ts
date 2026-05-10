import api from "../utils/api.ts";
import type { Coin, Insight, Meme, NewsItem, ContentType } from "../types/index.ts";

interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
}

export const fetchCoins = (limit = 10) =>
  api.get<PaginatedResponse<Coin>>("/coins", { params: { limit } });

export const fetchInsights = (limit = 3) =>
  api.get<PaginatedResponse<Insight>>("/insights", { params: { limit } });

export const fetchNews = (limit = 8) =>
  api.get<PaginatedResponse<NewsItem>>("/news", { params: { limit } });

export const fetchMemes = (limit = 1) =>
  api.get<PaginatedResponse<Meme>>("/memes", { params: { limit } });

export const submitVote = (type: ContentType, id: string, action: string) =>
  api.post<{ ok: boolean; likes: number; dislikes: number }>(`/vote/${type}/${id}`, { vote: action });
