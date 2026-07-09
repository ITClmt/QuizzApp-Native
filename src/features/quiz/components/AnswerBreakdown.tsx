import { Colors, Radius, Spacing } from "@/constants/theme";
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
                  {question?.questionEn ?? `Question ${index + 1}`}
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
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
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
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.onPrimary,
  },
  answerContent: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  answerQuestion: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  answerWrongText: {
    fontSize: 12,
    color: Colors.onErrorContainer,
  },
  answerCorrectText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.onSuccessContainer,
  },
});
