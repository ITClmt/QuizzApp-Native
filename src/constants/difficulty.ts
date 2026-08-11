import { Colors } from "@/constants/theme";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.success,
  medium: Colors.secondary,
  hard: Colors.error,
};
