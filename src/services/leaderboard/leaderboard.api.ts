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

export type LeaderboardFilter = Difficulty | "global";

export interface GlobalLeaderboardEntry {
  id: string;
  username: string;
  avatarSlug: string;
  xp: number;
  level: number;
}

export async function getGlobalLeaderboard(): Promise<
  GlobalLeaderboardEntry[]
> {
  return apiFetchAuthenticated<GlobalLeaderboardEntry[]>(
    `/score/leaderboard/global`,
  );
}

export interface GlobalMyRank {
  rank: number;
  xp: number;
  level: number;
}

export async function getMyGlobalRank(): Promise<GlobalMyRank | null> {
  return apiFetchAuthenticated<GlobalMyRank | null>(`/score/my-rank/global`);
}
