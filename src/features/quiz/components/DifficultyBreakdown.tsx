import { Colors, Radius, Spacing } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: Colors.success,
  medium: Colors.secondary,
  hard: Colors.error,
};

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

interface DifficultyBreakdownProps {
  details: { difficulty: string; value: number }[];
}

export default function DifficultyBreakdown({
  details,
}: DifficultyBreakdownProps) {
  if (details.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>By difficulty</Text>
      <View style={styles.detailsContainer}>
        {details.map((detail) => (
          <View key={detail.difficulty} style={styles.difficultyRow}>
            <View
              style={[
                styles.difficultyDot,
                {
                  backgroundColor:
                    DIFFICULTY_COLORS[detail.difficulty] ??
                    Colors.onSurfaceVariant,
                },
              ]}
            />
            <Text style={styles.difficultyLabel}>
              {DIFFICULTY_LABELS[detail.difficulty] ?? detail.difficulty}
            </Text>
            <Text style={styles.difficultyScore}>{detail.value} correct</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  detailsContainer: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
  },
  difficultyScore: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
});
