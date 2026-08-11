import { apiFetchAuthenticated } from "@/src/lib/api";
import type {
  HistoryDetail,
  HistoryPage,
  QuizResult,
  QuizSession,
} from "@/src/types";

export interface StartQuizParams {
  difficulty?: string;
  category?: string;
}

export interface QuizCategory {
  id: string;
  name: string;
  unlockLevel: number;
  unlocked: boolean;
}

export async function getQuizCategories() {
  return apiFetchAuthenticated<QuizCategory[]>(`/quiz/categories`);
}

export async function startQuizSession(params: StartQuizParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.difficulty) queryParams.append("difficulty", params.difficulty);
  if (params.category) queryParams.append("category", params.category);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return apiFetchAuthenticated<QuizSession>(`/quiz/start${queryString}`, {
    method: "POST",
  });
}

export async function cancelQuizSession(sessionId: string) {
  return apiFetchAuthenticated<QuizSession>(`/quiz/cancel`, {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

export interface FinishQuizParams {
  sessionId: string;
  answers: { questionId: string; answerIndex: number }[];
  timedOut: boolean;
}

export async function finishQuizSession(params: FinishQuizParams) {
  return apiFetchAuthenticated<QuizResult>(`/quiz/finish`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export interface GetQuizHistoryParams {
  cursor?: string;
  limit?: number;
}

export async function getQuizHistory(params: GetQuizHistoryParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.append("cursor", params.cursor);
  if (params.limit) queryParams.append("limit", String(params.limit));

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return apiFetchAuthenticated<HistoryPage>(`/quiz/history${queryString}`);
}

export async function getQuizHistoryDetail(sessionId: string) {
  return apiFetchAuthenticated<HistoryDetail>(`/quiz/history/${sessionId}`);
}
