import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export interface AnswerBreakdownRow {
  questionId: string;
  questionText?: string;
  isCorrect: boolean;
  userAnswerText?: string;
  correctAnswerText: string;
}

interface AnswerBreakdownProps {
  rows: AnswerBreakdownRow[];
}

export default function AnswerBreakdown({ rows }: AnswerBreakdownProps) {
  const { t } = useTranslation("quiz");
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("results.answerBreakdownTitle")}</Text>
      <View style={styles.answersContainer}>
        {rows.map((row, index) => (
          <View
            key={row.questionId}
            style={[
              styles.answerRow,
              row.isCorrect ? styles.answerRowCorrect : styles.answerRowWrong,
            ]}
          >
            <View
              style={[
                styles.answerIcon,
                row.isCorrect
                  ? styles.answerIconCorrect
                  : styles.answerIconWrong,
              ]}
            >
              <Text style={styles.answerIconText}>
                {row.isCorrect ? "✓" : "✗"}
              </Text>
            </View>
            <View style={styles.answerContent}>
              <Text style={styles.answerQuestion} numberOfLines={2}>
                {row.questionText ??
                  t("results.questionFallback", { number: index + 1 })}
              </Text>
              <Text
                style={
                  row.isCorrect ? styles.answerCorrectText : styles.answerWrongText
                }
              >
                {t("results.yourAnswer", { answer: row.userAnswerText })}
              </Text>
              {!row.isCorrect && (
                <Text style={styles.answerCorrectText}>
                  {t("results.correctAnswer", {
                    answer: row.correctAnswerText,
                  })}
                </Text>
              )}
            </View>
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
  answersContainer: {
    gap: Spacing.sm,
  },
  answerRow: {
    flexDirection: "row",
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  answerRowCorrect: {
    backgroundColor: Colors.successContainer,
  },
  answerRowWrong: {
    backgroundColor: Colors.errorContainer,
  },
  answerIcon: {
    width: 44,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
  },
  answerIconCorrect: {
    backgroundColor: Colors.success,
  },
  answerIconWrong: {
    backgroundColor: Colors.error,
  },
  answerIconText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleLg,
    color: Colors.onPrimary,
  },
  answerContent: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  answerQuestion: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  answerWrongText: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelMd,
    color: Colors.onErrorContainer,
  },
  answerCorrectText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelMd,
    color: Colors.onSuccessContainer,
  },
});
