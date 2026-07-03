import { apiFetchAuthenticated } from "@/src/lib/api";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";

export interface UserScore {
  id: string;
  value: number;
  difficulty: Difficulty;
  createdAt: string;
}

export interface UserScoresResponse {
  totalScore: number;
  scores: UserScore[];
}

export async function getUserScores(
  userId: string,
): Promise<UserScoresResponse> {
  return apiFetchAuthenticated<UserScoresResponse>(`/score/user/${userId}`);
}
