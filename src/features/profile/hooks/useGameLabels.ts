import { getCategoryLabelById } from "@/src/constants/categories";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { useTranslation } from "react-i18next";

export function useGameLabels(
  difficulty: Difficulty | null,
  category: string | null,
) {
  const { t, i18n } = useTranslation("quiz");

  const difficultyLabel = difficulty
    ? t(`difficulty.${difficulty}`)
    : t("history.anyDifficulty");
  const categoryLabel = category
    ? getCategoryLabelById(category, i18n.language)
    : t("history.anyCategory");

  return { difficultyLabel, categoryLabel };
}
