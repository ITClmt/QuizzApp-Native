import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { CircularTimer } from "@/src/features/quiz/components/CircularTimer";
import CancelSessionButton from "@/src/features/quiz/components/CancelSessionButton";
import { DottedProgress } from "@/src/features/quiz/components/DottedProgress";
import {
  finishQuizSession,
  startQuizSession,
} from "@/src/services/quiz/quiz.api";
import type { QuizQuestion, QuizResult, QuizSession } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUIZ_DURATION_SECONDS = 1.5 * 60;
const LOW_TIME_THRESHOLD_SECONDS = 30;

export default function QuizScreen() {
  const { difficulty, category } = useLocalSearchParams<{
    difficulty: string;
    category?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION_SECONDS);
  const hasEndedRef = useRef(false);

  const handleAnswer = (answerIndex: number) => {
    const isCorrect =
      answerIndex === questions[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setShowAnswer(true);
    setUserAnswers((prev) => [...prev, answerIndex]);
  };

  const endQuiz = () => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    finishSession();
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      endQuiz();
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
    mutationFn: () => startQuizSession({ difficulty, category }),
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
          answers: userAnswers.map((answerIndex, i) => ({
            questionId: questions[i].id,
            answerIndex,
          })),
        }),
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data?.createdAt || hasEndedRef.current) return;

    const deadline =
      new Date(data.createdAt).getTime() + QUIZ_DURATION_SECONDS * 1000;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        endQuiz();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.createdAt]);

  if (isPending) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Starting your session...</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (isError) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (questions.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswerIndex = userAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isUrgent = timeLeft <= LOW_TIME_THRESHOLD_SECONDS;

  const getButtonStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctButton;
    if (index === selectedAnswerIndex) return styles.wrongButton;
    return null;
  };

  const getAnswerTextStyle = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return styles.correctAnswerText;
    if (index === selectedAnswerIndex) return styles.wrongAnswerText;
    return null;
  };

  const renderStatusIcon = (index: number) => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) {
      return (
        <View style={[styles.statusIcon, styles.statusIconCorrect]}>
          <MaterialIcons name="check" size={16} color={Colors.onSuccess} />
        </View>
      );
    }
    if (index === selectedAnswerIndex) {
      return (
        <View style={[styles.statusIcon, styles.statusIconWrong]}>
          <MaterialIcons name="close" size={16} color={Colors.onError} />
        </View>
      );
    }
    return null;
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CancelSessionButton sessionId={data!.sessionId} />
          <DottedProgress total={questions.length} current={currentQuestionIndex} />
          <View style={styles.headerSpacer} />
        </View>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <CircularTimer
            secondsLeft={timeLeft}
            totalSeconds={QUIZ_DURATION_SECONDS}
            urgent={isUrgent}
          />
        </View>

        {/* Category + question label */}
        <Text style={styles.metaLabel}>
          {currentQuestion.category.toUpperCase()} · QUESTION{" "}
          {currentQuestionIndex + 1}/{questions.length}
        </Text>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
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
              <Text style={[styles.answerText, getAnswerTextStyle(index)]}>
                {answer}
              </Text>
              {renderStatusIcon(index)}
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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.onSurfaceVariant,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyMd,
  },
  errorText: {
    color: Colors.error,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyMd,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  headerSpacer: {
    width: 36,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  metaLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  questionContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: Spacing.lg,
  },
  questionText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineMd,
    color: Colors.onSurface,
    textAlign: "center",
    lineHeight: 28,
  },
  answersContainer: {
    gap: Spacing.sm,
  },
  answerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...Shadows.card,
  },
  answerText: {
    flex: 1,
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  // Correct answer
  correctButton: {
    backgroundColor: Colors.successContainer,
    borderColor: Colors.success,
  },
  correctAnswerText: {
    color: Colors.onSuccessContainer,
  },
  // Wrong answer
  wrongButton: {
    backgroundColor: Colors.errorContainer,
    borderColor: Colors.error,
  },
  wrongAnswerText: {
    color: Colors.onErrorContainer,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
  statusIconCorrect: {
    backgroundColor: Colors.success,
  },
  statusIconWrong: {
    backgroundColor: Colors.error,
  },
  // Next button
  nextButton: {
    marginTop: Spacing.xs,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    ...Shadows.card,
  },
  nextButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLg,
    color: Colors.onPrimary,
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
});
