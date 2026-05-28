import { apiFetchAuthenticated } from "@/src/lib/api";
import type { QuizResult, QuizSession } from "@/src/types";

export interface StartQuizParams {
  difficulty?: string;
  category?: string;
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
}

export async function finishQuizSession(params: FinishQuizParams) {
  return apiFetchAuthenticated<QuizResult>(`/quiz/finish`, {
    method: "POST",
    body: JSON.stringify(params),
  });
}
