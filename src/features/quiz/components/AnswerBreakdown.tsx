import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import type { QuizAnswerResult, QuizQuestion } from "@/src/types";
import { StyleSheet, Text, View } from "react-native";

interface AnswerBreakdownProps {
  answers: QuizAnswerResult[];
  questionMap: Map<string, QuizQuestion>;
  userAnswers: number[];
}

export default function AnswerBreakdown({
  answers,
  questionMap,
  userAnswers,
}: AnswerBreakdownProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Answer breakdown</Text>
      <View style={styles.answersContainer}>
        {answers.map((answer, index) => {
          const question = questionMap.get(answer.questionId);
          const userAnswerText = question?.answers[userAnswers[index]];
          return (
            <View
              key={answer.questionId}
              style={[
                styles.answerRow,
                answer.isCorrect
                  ? styles.answerRowCorrect
                  : styles.answerRowWrong,
              ]}
            >
              <View
                style={[
                  styles.answerIcon,
                  answer.isCorrect
                    ? styles.answerIconCorrect
                    : styles.answerIconWrong,
                ]}
              >
                <Text style={styles.answerIconText}>
                  {answer.isCorrect ? "✓" : "✗"}
                </Text>
              </View>
              <View style={styles.answerContent}>
                <Text style={styles.answerQuestion} numberOfLines={2}>
                  {question?.question ?? `Question ${index + 1}`}
                </Text>
                {!answer.isCorrect && (
                  <>
                    <Text style={styles.answerWrongText}>
                      Your answer: {userAnswerText}
                    </Text>
                    <Text style={styles.answerCorrectText}>
                      Correct answer: {answer.correctAnswer}
                    </Text>
                  </>
                )}
              </View>
            </View>
          );
        })}
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
