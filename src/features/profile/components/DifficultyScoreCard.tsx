import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { DIFFICULTY_COLORS } from "@/src/constants/difficulty";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface DifficultyScoreCardProps {
  difficulty: Difficulty;
  value: number;
  maxValue: number;
}

export function DifficultyScoreCard({
  difficulty,
  value,
  maxValue,
}: DifficultyScoreCardProps) {
  const { t } = useTranslation("quiz");
  const color = DIFFICULTY_COLORS[difficulty];
  const ratio = maxValue > 0 ? value / maxValue : 0;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.label}>{t(`difficulty.${difficulty}`)}</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${ratio * 100}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  barTrack: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
  value: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleLg,
    minWidth: 32,
    textAlign: "right",
  },
});
