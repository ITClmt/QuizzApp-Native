import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface ScoreSummaryProps {
  score: number;
  total: number;
}

function getScoreLabelKey(percentage: number): string {
  if (percentage === 100) return "results.scoreLabel.perfect";
  if (percentage >= 80) return "results.scoreLabel.excellent";
  if (percentage >= 60) return "results.scoreLabel.good";
  if (percentage >= 40) return "results.scoreLabel.okay";
  return "results.scoreLabel.low";
}

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return Colors.success;
  if (percentage >= 50) return Colors.secondary;
  return Colors.error;
}

export default function ScoreSummary({ score, total }: ScoreSummaryProps) {
  const { t } = useTranslation("quiz");

  if (total === 0) {
    return (
      <View style={styles.scoreCard}>
        <Text style={styles.finishedLabel}>{t("results.quizCompleted")}</Text>
        <Text style={[styles.scoreLabel, { color: Colors.onSurfaceVariant }]}>
          {t("results.timesUp")}
        </Text>
        <Text style={styles.percentageText}>{t("results.noAnswerInTime")}</Text>
      </View>
    );
  }

  const percentage = Math.round((score / total) * 100);
  const scoreColor = getScoreColor(percentage);

  return (
    <View style={styles.scoreCard}>
      <Text style={styles.finishedLabel}>{t("results.quizCompleted")}</Text>
      <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
        <Text style={[styles.scoreNumber, { color: scoreColor }]}>{score}</Text>
        <Text style={[styles.scoreTotal, { color: scoreColor }]}>
          / {total}
        </Text>
      </View>
      <Text style={[styles.scoreLabel, { color: scoreColor }]}>
        {t(getScoreLabelKey(percentage))}
      </Text>
      <Text style={styles.percentageText}>
        {t("results.percentCorrect", { percentage })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  finishedLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: Spacing.lg,
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.elevated,
  },
  scoreNumber: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.displayLg,
    lineHeight: 56,
  },
  scoreTotal: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.headlineSm,
    marginBottom: 10,
    marginLeft: Spacing.xs,
  },
  scoreLabel: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineSm,
    marginBottom: Spacing.xs,
  },
  percentageText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
