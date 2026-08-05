import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
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
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },
  detailsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    ...Shadows.card,
  },
  difficultyRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.base,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  difficultyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  difficultyLabel: {
    flex: 1,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  difficultyScore: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurfaceVariant,
  },
});
