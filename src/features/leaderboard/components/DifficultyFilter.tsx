import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DIFFICULTIES: { label: string; difficulty: Difficulty }[] = [
  { label: "Easy", difficulty: "easy" },
  { label: "Medium", difficulty: "medium" },
  { label: "Hard", difficulty: "hard" },
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: Colors.success,
  medium: Colors.secondary,
  hard: Colors.error,
};

interface DifficultyFilterProps {
  difficulty: Difficulty;
  setDifficulty: (d: Difficulty) => void;
}

export function DifficultyFilter({
  difficulty,
  setDifficulty,
}: DifficultyFilterProps) {
  return (
    <View style={styles.row}>
      {DIFFICULTIES.map((d) => {
        const active = difficulty === d.difficulty;
        return (
          <Pressable
            key={d.difficulty}
            onPress={() => setDifficulty(d.difficulty)}
            style={[
              styles.btn,
              active && {
                backgroundColor: DIFFICULTY_COLORS[d.difficulty],
                borderColor: DIFFICULTY_COLORS[d.difficulty],
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                active
                  ? styles.textActive
                  : { color: DIFFICULTY_COLORS[d.difficulty] },
              ]}
            >
              {d.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: "center",
  },
  text: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.titleSm,
  },
  textActive: {
    color: "#ffffff",
  },
});
