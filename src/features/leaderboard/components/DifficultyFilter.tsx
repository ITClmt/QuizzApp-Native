import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { LeaderboardFilter } from "@/src/services/leaderboard/leaderboard.api";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DIFFICULTIES: { label: string; difficulty: LeaderboardFilter }[] = [
  { label: "Easy", difficulty: "easy" },
  { label: "Medium", difficulty: "medium" },
  { label: "Hard", difficulty: "hard" },
  { label: "Global", difficulty: "global" },
];

interface DifficultyFilterProps {
  difficulty: LeaderboardFilter;
  setDifficulty: (d: LeaderboardFilter) => void;
}

export function DifficultyFilter({
  difficulty,
  setDifficulty,
}: DifficultyFilterProps) {
  return (
    <View style={styles.track}>
      {DIFFICULTIES.map((d) => {
        const active = difficulty === d.difficulty;
        return (
          <Pressable
            key={d.difficulty}
            onPress={() => setDifficulty(d.difficulty)}
            style={[styles.btn, active && styles.btnActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {d.label}
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
