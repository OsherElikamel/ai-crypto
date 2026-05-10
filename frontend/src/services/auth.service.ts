import api from "../utils/api.ts";
import type { AuthResponse, User } from "../types/index.ts";

export const loginUser = (body: { email: string; password: string }) =>
  api.post<AuthResponse>("/auth/login", body);

export const registerUser = (body: { name: string; email: string; password: string }) =>
  api.post<AuthResponse>("/auth/register", body);

export const getMe = () =>
  api.get<{ user: User }>("/auth/me");
