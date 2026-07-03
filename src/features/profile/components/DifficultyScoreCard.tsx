import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { StyleSheet, Text, View } from "react-native";

const DIFFICULTY_META: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: Colors.success },
  medium: { label: "Medium", color: Colors.secondary },
  hard: { label: "Hard", color: Colors.error },
};

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
  const meta = DIFFICULTY_META[difficulty];
  const ratio = maxValue > 0 ? value / maxValue : 0;

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.label}>{meta.label}</Text>
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              { width: `${ratio * 100}%`, backgroundColor: meta.color },
            ]}
          />
        </View>
      </View>
      <Text style={[styles.value, { color: meta.color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
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
