import { apiFetch } from "@/src/lib/api";
import * as SecureStore from "expo-secure-store";

export interface StartQuizParams {
  difficulty?: string;
  category?: string;
}

export async function startQuizSession(params: StartQuizParams = {}) {
  const accessToken = await SecureStore.getItemAsync("access_token");

  if (!accessToken) {
    throw new Error("You must be logged in to start a quiz");
  }

  const queryParams = new URLSearchParams();
  if (params.difficulty) queryParams.append("difficulty", params.difficulty);
  if (params.category) queryParams.append("category", params.category);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return apiFetch<QuizSession>(`/quiz/start${queryString}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function cancelQuizSession(sessionId: string) {
  const accessToken = await SecureStore.getItemAsync("access_token");

  if (!accessToken) {
    throw new Error("You must be logged in to cancel a quiz");
  }

  return apiFetch<QuizSession>(`/quiz/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ sessionId }),
  });
}
