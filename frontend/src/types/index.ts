export interface Preferences {
  coins: string[];
  investorType: "HODL" | "DABBLER" | "TRADER" | "NFT_DEFI" | null;
  contentTypes: string[];
  risk: "LOW" | "MEDIUM" | "HIGH" | null;
  fiat: string[];
  depth: "SHORT" | "MEDIUM" | "DEEP" | null;
  alerts: boolean;
  avoid: string[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
  onboarded: boolean;
  preferences?: Preferences;
}

export interface Coin {
  _id: string;
  symbol: string;
  name: string;
  coingeckoId: string;
  price?: number | null;
  change24h?: number | null;
  marketCap?: number | null;
  volume24h?: number | null;
  rank?: number | null;
  priceUpdatedAt?: string | null;
  likedBy: string[];
  dislikedBy: string[];
  likeCount?: number;
  dislikeCount?: number;
}

export interface Insight {
  _id: string;
  title: string;
  text: string;
  tags: string[];
  tickers: string[];
  likedBy: string[];
  dislikedBy: string[];
  likeCount?: number;
  dislikeCount?: number;
}

export interface NewsItem {
  _id: string;
  sourceId?: string;
  title: string;
  url: string;
  source?: string;
  tickers: string[];
  likedBy: string[];
  dislikedBy: string[];
  likeCount?: number;
  dislikeCount?: number;
  createdAt?: string;
}

export interface Meme {
  _id: string;
  imageUrl: string;
  title?: string;
  tags: string[];
  source?: string;
  active: boolean;
  likedBy: string[];
  dislikedBy: string[];
  likeCount?: number;
  dislikeCount?: number;
}

export interface Question {
  id: string;
  type: "single" | "multi" | "boolean";
  question: string;
  options: string[];
}

export interface VoteResponse {
  ok: boolean;
  id: string;
  likes: number;
  dislikes: number;
  status: "like" | "dislike" | "none";
}

export interface AuthResponse {
  token: string;
  needsOnboarding: boolean;
}

export type VotableItem = Coin | Insight | NewsItem | Meme;
export type ContentType = "coins" | "insights" | "news" | "memes";
