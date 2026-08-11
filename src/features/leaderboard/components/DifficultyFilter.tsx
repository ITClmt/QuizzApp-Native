import { SegmentedControl } from "@/src/components/SegmentedControl";
import type { LeaderboardFilter } from "@/src/services/leaderboard/leaderboard.api";
import { useTranslation } from "react-i18next";

const DIFFICULTIES: LeaderboardFilter[] = ["easy", "medium", "hard", "global"];

interface DifficultyFilterProps {
  difficulty: LeaderboardFilter;
  setDifficulty: (d: LeaderboardFilter) => void;
}

export function DifficultyFilter({
  difficulty,
  setDifficulty,
}: DifficultyFilterProps) {
  const { t } = useTranslation(["quiz", "leaderboard"]);

  const options = DIFFICULTIES.map((d) => ({
    value: d,
    label:
      d === "global" ? t("leaderboard:filters.global") : t(`difficulty.${d}`),
  }));

  return (
    <SegmentedControl
      options={options}
      value={difficulty}
      onChange={setDifficulty}
      accessibilityLabel={t("leaderboard:filters.accessibilityLabel")}
    />
  );
}
