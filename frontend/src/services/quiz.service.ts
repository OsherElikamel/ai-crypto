import api from "../utils/api.ts";
import type { Question } from "../types/index.ts";

export const getQuestions = () =>
  api.get<{ questions: Question[] }>("/quiz/questions");

export const submitAnswers = (answers: Record<string, unknown>) =>
  api.post<{ ok: boolean; onboarded: boolean }>("/quiz/answers", { answers });
