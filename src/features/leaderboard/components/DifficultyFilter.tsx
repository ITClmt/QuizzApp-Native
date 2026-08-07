import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { LeaderboardFilter } from "@/src/services/leaderboard/leaderboard.api";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

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

  return (
    <View style={styles.track}>
      {DIFFICULTIES.map((d) => {
        const active = difficulty === d;
        const label = d === "global" ? t("leaderboard:filters.global") : t(`difficulty.${d}`);
        return (
          <Pressable
            key={d}
            onPress={() => setDifficulty(d)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 4,
    gap: 4,
    ...Shadows.card,
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.xl - 4,
    alignItems: "center",
  },
  btnActive: {
    backgroundColor: Colors.primary,
  },
  text: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurfaceVariant,
  },
  textActive: {
    color: Colors.white,
  },
});
