import { Colors, Radius, Spacing } from "@/constants/theme";
import CancelSessionButton from "@/src/features/quiz/components/CancelSessionButton";
import {
  finishQuizSession,
  startQuizSession,
} from "@/src/services/quiz/quiz.api";
import type { QuizQuestion, QuizResult, QuizSession } from "@/src/types";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ANSWER_LABELS = ["A", "B", "C", "D"];

export default function QuizScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  const handleAnswer = (answerIndex: number) => {
    setShowAnswer(true);
    setUserAnswers((prev) => [...prev, answerIndex]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      finishSession();
    } else {
      setShowAnswer(false);
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const {
    mutate: startSession,
    isPending,
    isError,
    error,
    data,
  } = useMutation<QuizSession>({
    mutationFn: () => startQuizSession({ difficulty }),
    onSuccess: (session) => {
      setQuestions(session.questions);
    },
    onError: (err) => {
      Alert.alert("Error", err.message);
    },
  });

  const { mutate: finishSession, isPending: isFinishing } =
    useMutation<QuizResult>({
      mutationFn: () =>
        finishQuizSession({
          sessionId: data!.sessionId,
          answers: questions.map((q, i) => ({
            questionId: q.id,
            answerIndex: userAnswers[i],
          })),
        }),
      onSuccess: (result) => {
        router.replace({
          pathname: "/(quiz)/results",
          params: {
            result: JSON.stringify(result),
            questions: JSON.stringify(questions),
            userAnswers: JSON.stringify(userAnswers),
          },
        });
      },
      onError: (err) => {
        Alert.alert("Error", err.message);
      },
    });

  useEffect(() => {
    startSession();
  }, []);

  if (isPending) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Starting your session...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerIndex = userAnswers[currentQuestionIndex];
  const progress = currentQuestionIndex / questions.length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const getButtonStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctButton;
    if (index === selectedAnswerIndex) return styles.wrongButton;
    return null;
  };

  const getBadgeStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctBadge;
    if (index === selectedAnswerIndex) return styles.wrongBadge;
    return null;
  };

  const getBadgeTextStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctBadgeText;
    if (index === selectedAnswerIndex) return styles.wrongBadgeText;
    return null;
  };

  const getDividerStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctDivider;
    if (index === selectedAnswerIndex) return styles.wrongDivider;
    return null;
  };

  const getAnswerTextStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctAnswerText;
    if (index === selectedAnswerIndex) return styles.wrongAnswerText;
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <CancelSessionButton sessionId={data!.sessionId} />
        <Text style={styles.questionCounter}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.questionEn}</Text>
      </View>

      {/* Answers */}
      <View style={styles.answersContainer}>
        {currentQuestion.answers.map((answer, index) => (
          <Pressable
            key={index}
            style={[styles.answerButton, getButtonStyle(index)]}
            onPress={() => handleAnswer(index)}
            disabled={showAnswer}
          >
            <View style={[styles.answerBadge, getBadgeStyle(index)]}>
              <Text style={[styles.answerBadgeText, getBadgeTextStyle(index)]}>
                {ANSWER_LABELS[index]}
              </Text>
            </View>
            <View style={[styles.answerDivider, getDividerStyle(index)]} />
            <Text style={[styles.answerText, getAnswerTextStyle(index)]}>
              {answer}
            </Text>
          </Pressable>
        ))}

        {showAnswer && (
          <Pressable
            style={[
              styles.nextButton,
              isFinishing && styles.nextButtonDisabled,
            ]}
            onPress={handleNextQuestion}
            disabled={isFinishing}
          >
            {isFinishing ? (
              <ActivityIndicator color={Colors.onPrimary} />
            ) : (
              <Text style={styles.nextButtonText}>
                {isLastQuestion ? "Voir mes résultats" : "Next Question →"}
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.onSurfaceVariant,
    fontSize: 14,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  questionCounter: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurfaceVariant,
  },
  progressTrack: {
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    marginBottom: Spacing["2xl"],
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
  },
  questionText: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.onSurface,
    lineHeight: 36,
  },
  answersContainer: {
    gap: Spacing.sm,
  },
  answerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  answerBadge: {
    width: 52,
    alignSelf: "stretch",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  answerBadgeText: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.onPrimary,
  },
  answerDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: Colors.outlineVariant,
  },
  answerText: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  // Correct answer
  correctButton: {
    backgroundColor: Colors.successContainer,
  },
  correctBadge: {
    backgroundColor: Colors.success,
  },
  correctBadgeText: {
    color: Colors.onSuccess,
  },
  correctDivider: {
    backgroundColor: Colors.successDim,
  },
  correctAnswerText: {
    color: Colors.onSuccessContainer,
    fontWeight: "600",
  },
  // Wrong answer
  wrongButton: {
    backgroundColor: Colors.errorContainer,
  },
  wrongBadge: {
    backgroundColor: Colors.error,
  },
  wrongBadgeText: {
    color: Colors.onError,
  },
  wrongDivider: {
    backgroundColor: Colors.errorDim,
  },
  wrongAnswerText: {
    color: Colors.onErrorContainer,
    fontWeight: "600",
  },
  // Next button
  nextButton: {
    marginTop: Spacing.xs,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.onPrimary,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
});
