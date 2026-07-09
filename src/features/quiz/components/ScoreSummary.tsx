import { Colors, Radius, Spacing } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface ScoreSummaryProps {
  score: number;
  total: number;
}

function getScoreLabel(percentage: number): string {
  if (percentage === 100) return "Perfect!";
  if (percentage >= 80) return "Excellent!";
  if (percentage >= 60) return "Well done!";
  if (percentage >= 40) return "Not bad!";
  return "Keep learning!";
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return Colors.success;
  if (percentage >= 50) return Colors.secondary;
  return Colors.error;
}

export default function ScoreSummary({ score, total }: ScoreSummaryProps) {
  if (total === 0) {
    return (
      <View style={styles.scoreCard}>
        <Text style={styles.finishedLabel}>Quiz completed</Text>
        <Text style={[styles.scoreLabel, { color: Colors.onSurfaceVariant }]}>
          Time&apos;s up!
        </Text>
        <Text style={styles.percentageText}>No question answered in time.</Text>
      </View>
    );
  }

  const percentage = Math.round((score / total) * 100);
  const scoreColor = getScoreColor(percentage);

  return (
    <View style={styles.scoreCard}>
      <Text style={styles.finishedLabel}>Quiz completed</Text>
      <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
        <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
        <Text style={[styles.scoreTotal, { color: scoreColor }]}>
          / {total}
        </Text>
      </View>
      <Text style={[styles.scoreLabel, { color: scoreColor }]}>
        {getScoreLabel(percentage)}
      </Text>
      <Text style={styles.percentageText}>{percentage}% correct answers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    alignItems: "center",
    marginVertical: Spacing["2xl"],
  },
  finishedLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: Spacing.lg,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 3,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scoreNumber: {
    fontSize: 64,
    fontWeight: "bold",
    lineHeight: 72,
  },
  scoreTotal: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: Spacing.xs,
  },
  scoreLabel: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: Spacing.xs,
  },
  percentageText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
});
