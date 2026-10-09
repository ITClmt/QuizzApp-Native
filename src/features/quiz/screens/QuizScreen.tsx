import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAlert } from "@/src/contexts/AlertContext";
import { getCategoryLabelByName } from "@/src/constants/categories";
import {
  AnswerFeedback,
  type AnswerFeedbackState,
} from "@/src/features/quiz/components/AnswerFeedback";
import { CircularTimer } from "@/src/features/quiz/components/CircularTimer";
import CancelSessionButton from "@/src/features/quiz/components/CancelSessionButton";
import { QuestionProgress } from "@/src/features/quiz/components/QuestionProgress";
import { useCancelQuizSession } from "@/src/features/quiz/hooks/useCancelQuizSession";
import { storeQuizResult } from "@/src/features/quiz/hooks/useQuizResult";
import { useQuizKeyboardShortcuts } from "@/src/features/quiz/hooks/useQuizKeyboardShortcuts";
import { useBlockBackNavigation } from "@/src/hooks/useBlockBackNavigation";
import { ApiError, getErrorMessage } from "@/src/lib/api";
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
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LOW_TIME_THRESHOLD_SECONDS = 20;
// Petits écrans Android : le chrono rétrécit pour laisser la place à la question
const COMPACT_SCREEN_HEIGHT = 720;
// Au-delà, la question passe dans une taille plus petite
const LONG_QUESTION_LENGTH = 120;

export default function QuizScreen() {
  const { difficulty, category } = useLocalSearchParams<{
    difficulty: string;
    category?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { t, i18n } = useTranslation(["quiz", "common"]);
  const { height: screenHeight } = useWindowDimensions();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const hasEndedRef = useRef(false);
  const hasAnsweredRef = useRef(false);

  const handleAnswer = (answerIndex: number) => {
    if (hasAnsweredRef.current) return;
    hasAnsweredRef.current = true;

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

  const endQuiz = (timedOut: boolean) => {
    if (hasEndedRef.current) return;
    hasEndedRef.current = true;
    finishSession(timedOut);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      endQuiz(false);
    } else {
      hasAnsweredRef.current = false;
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
  } = useMutation<QuizSession, ApiError>({
    mutationFn: () => startQuizSession({ difficulty, category }),
    onSuccess: (session) => {
      setQuestions(session.questions);
    },
    onError: (err) => {
      showAlert(t("common:errors.title"), getErrorMessage(err));
    },
  });

  const { mutate: finishSession, isPending: isFinishing } = useMutation<
    QuizResult,
    ApiError,
    boolean
  >({
    mutationFn: (timedOut) =>
      finishQuizSession({
        sessionId: data!.sessionId,
        answers: userAnswers.map((answerIndex, i) => ({
          questionId: questions[i].id,
          answerIndex,
        })),
        timedOut,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      storeQuizResult(queryClient, data!.sessionId, {
        result,
        questions,
        userAnswers,
      });
      router.replace({
        pathname: "/(quiz)/results",
        params: { sessionId: data!.sessionId },
      });
    },
    onError: (err) => {
      showAlert(t("common:errors.title"), getErrorMessage(err));
    },
  });

  const { confirmCancel, isPending: isCancelling } = useCancelQuizSession(
    data?.sessionId,
  );

  // L'envoi des réponses est déjà parti : annuler maintenant courserait la
  // requête de fin de session.
  const requestCancel = () => {
    if (isFinishing) return;
    confirmCancel();
  };

  useBlockBackNavigation(requestCancel);

  const { showKeyHints } = useQuizKeyboardShortcuts({
    answerCount: questions[currentQuestionIndex]?.answers.length ?? 0,
    canAnswer: questions.length > 0 && !showAnswer && !isFinishing,
    canGoNext: showAnswer && !isFinishing,
    onAnswer: handleAnswer,
    onNext: handleNextQuestion,
    onCancel: requestCancel,
  });

  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Durée envoyée par le back : la changer ne demande pas de nouvelle version de l'app
  const durationSeconds = data ? Math.round(data.durationMs / 1000) : 0;

  useEffect(() => {
    if (!data?.createdAt || hasEndedRef.current) return;

    const deadline = new Date(data.createdAt).getTime() + data.durationMs;

    let interval: ReturnType<typeof setInterval> | undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (interval) clearInterval(interval);
        endQuiz(true);
      }
    };

    tick();
    if (!hasEndedRef.current) {
      interval = setInterval(tick, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.createdAt]);

  if (isPending) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{t("session.startingSession")}</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (isError) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <ErrorNotice
            message={t("session.errorPrefix", {
              message: getErrorMessage(error),
            })}
            onRetry={startSession}
          />
          <Button
            variant="outlined"
            title={t("results.home")}
            onPress={() => router.replace("/(app)")}
          />
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
  const isLongQuestion = currentQuestion.question.length > LONG_QUESTION_LENGTH;

  const getFeedbackState = (index: number): AnswerFeedbackState => {
    if (!showAnswer) return null;
    if (index === currentQuestion.correctIndex) return "correct";
    if (index === selectedAnswerIndex) return "wrong";
    return null;
  };

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
          <CancelSessionButton
            onPress={confirmCancel}
            isPending={isCancelling}
          />
          <QuestionProgress
            total={questions.length}
            current={currentQuestionIndex}
          />
          <View style={styles.headerSpacer} />
        </View>

        {/* Tout le corps défile : une question longue ne se retrouve jamais
            coincée dans une petite zone au-dessus des réponses */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer */}
          <View style={styles.timerContainer}>
            <CircularTimer
              secondsLeft={timeLeft}
              totalSeconds={durationSeconds}
              urgent={isUrgent}
              size={screenHeight < COMPACT_SCREEN_HEIGHT ? 110 : 150}
            />
          </View>

          {/* Category + question label */}
          <Text style={styles.metaLabel}>
            {t("session.metaLabel", {
              category: getCategoryLabelByName(
                currentQuestion.category,
                i18n.language,
              ).toUpperCase(),
              current: currentQuestionIndex + 1,
              total: questions.length,
            })}
          </Text>

          {/* Question */}
          <View style={styles.questionContainer}>
            <Text
              style={[
                styles.questionText,
                isLongQuestion && styles.questionTextLong,
              ]}
            >
              {currentQuestion.question}
            </Text>
          </View>

          {/* Answers */}
          <View style={styles.answersContainer}>
            {currentQuestion.answers.map((answer, index) => (
              <AnswerFeedback key={index} state={getFeedbackState(index)}>
                <Pressable
                  style={({ pressed }) => [
                    styles.answerButton,
                    getButtonStyle(index),
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleAnswer(index)}
                  disabled={showAnswer || isFinishing}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: showAnswer || isFinishing }}
                >
                  {showKeyHints && (
                    <View style={styles.keyHint}>
                      <Text style={styles.keyHintText}>{index + 1}</Text>
                    </View>
                  )}
                  <Text style={[styles.answerText, getAnswerTextStyle(index)]}>
                    {answer}
                  </Text>
                  {renderStatusIcon(index)}
                </Pressable>
              </AnswerFeedback>
            ))}

            {showAnswer && (
              <Pressable
                style={({ pressed }) => [
                  styles.nextButton,
                  isFinishing && styles.nextButtonDisabled,
                  pressed && styles.pressed,
                ]}
                onPress={handleNextQuestion}
                disabled={isFinishing}
                accessibilityRole="button"
                accessibilityState={{ disabled: isFinishing }}
              >
                {isFinishing ? (
                  <ActivityIndicator color={Colors.onPrimary} />
                ) : (
                  <Text style={styles.nextButtonText}>
                    {isLastQuestion
                      ? t("session.viewResults")
                      : t("session.nextQuestion")}
                  </Text>
                )}
              </Pressable>
            )}
          </View>
        </ScrollView>
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
    width: 48,
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
  // Le ScrollView coupe ce qui le dépasse : on l'étend jusqu'aux bords de
  // l'écran et on remet la marge dans son contenu, pour que le rebond et la
  // secousse des réponses aient la place de s'animer sans être rognés.
  body: {
    flex: 1,
    marginHorizontal: -Spacing.xl,
  },
  bodyContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  questionContainer: {
    flexGrow: 1,
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
  questionTextLong: {
    fontSize: FontSize.titleLg,
    lineHeight: 24,
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
  pressed: {
    opacity: 0.8,
  },
  keyHint: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  keyHintText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurfaceVariant,
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
