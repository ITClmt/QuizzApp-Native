import { apiFetchAuthenticated } from "@/src/lib/api";

export type Difficulty = "easy" | "medium" | "hard";

export interface LeaderboardEntry {
  id: string;
  value: number;
  difficulty: Difficulty;
  userData: {
    id: string;
    username: string;
    avatarSlug: string;
  };
  createdAt: string;
}

export async function getLeaderboard(
  difficulty: Difficulty,
): Promise<LeaderboardEntry[]> {
  return apiFetchAuthenticated<LeaderboardEntry[]>(
    `/score/leaderboard?difficulty=${difficulty}`,
  );
}

export interface MyRank {
  rank: number;
  value: number;
}

export async function getMyRank(
  difficulty: Difficulty,
): Promise<MyRank | null> {
  return apiFetchAuthenticated<MyRank | null>(
    `/score/my-rank?difficulty=${difficulty}`,
  );
}
