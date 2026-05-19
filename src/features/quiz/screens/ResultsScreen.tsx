import { Colors, Radius, Spacing } from "@/constants/theme";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function ResultsScreen() {
  const router = useRouter();
  const {
    result: resultParam,
    questions: questionsParam,
    userAnswers: userAnswersParam,
  } = useLocalSearchParams<{
    result: string;
    questions: string;
    userAnswers: string;
  }>();

  const result: QuizResult = JSON.parse(resultParam);
  const questions: QuizQuestion[] = JSON.parse(questionsParam);
  const userAnswers: number[] = JSON.parse(userAnswersParam);

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const percentage = Math.round((result.totalScore / questions.length) * 100);
  const scoreColor = getScoreColor(percentage);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.finishedLabel}>Quiz completed</Text>
          <View style={[styles.scoreBadge, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreNumber, { color: scoreColor }]}>
              {result.totalScore}
            </Text>
            <Text style={[styles.scoreTotal, { color: scoreColor }]}>
              / {questions.length}
            </Text>
          </View>
          <Text style={[styles.scoreLabel, { color: scoreColor }]}>
            {getScoreLabel(percentage)}
          </Text>
          <Text style={styles.percentageText}>
            {percentage}% correct answers
          </Text>
        </View>

        {/* By difficulty */}
        {result.details.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>By difficulty</Text>
            <View style={styles.detailsContainer}>
              {result.details.map((detail) => (
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
                  <Text style={styles.difficultyScore}>
                    {detail.value} correct
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Answer breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Answer breakdown</Text>
          <View style={styles.answersContainer}>
            {result.answers.map((answer, index) => {
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
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={styles.replayButton}
          onPress={() => router.replace("/(quiz)/preQuiz")}
        >
          <Text style={styles.replayButtonText}>Play again</Text>
        </Pressable>
        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace("/(app)")}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },

  // Score card
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

  // Sections
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.onSurface,
    marginBottom: Spacing.md,
  },

  // Difficulty
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

  // Answer rows
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

  // Actions
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
  },
  replayButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
  },
  replayButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  homeButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.onPrimary,
  },
});
