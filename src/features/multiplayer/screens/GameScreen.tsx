import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { getCategoryLabelByOtdName } from "@/src/constants/categories";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  AnswerFeedback,
  type AnswerFeedbackState,
} from "@/src/features/quiz/components/AnswerFeedback";
import { CircularTimer } from "@/src/features/quiz/components/CircularTimer";
import { QuestionProgress } from "@/src/features/quiz/components/QuestionProgress";
import { useQuizKeyboardShortcuts } from "@/src/features/quiz/hooks/useQuizKeyboardShortcuts";
import { useBlockBackNavigation } from "@/src/hooks/useBlockBackNavigation";
import type { GameEnd, GameReveal, LobbyPlayer } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LEAVE_BUTTON_SIZE, LeaveButton } from "../components/LeaveButton";
import { PlayersStrip } from "../components/PlayersStrip";
import { ACTIVE_GAME_KEY } from "../hooks/useActiveGame";
import { useCountdown } from "../hooks/useCountdown";
import { storeGameResult } from "../hooks/useGameResult";
import { useLiveGame } from "../hooks/useLiveGame";
import { getSocketErrorMessage } from "../utils/socketErrorMessage";

// Mêmes valeurs que le serveur (QUESTION_MS), qui reste seul juge du temps
const QUESTION_SECONDS = 12;
const URGENT_SECONDS = 3;

// Pas de « question suivante » à déclencher : c'est le serveur qui enchaîne
const noop = () => {};

export default function GameScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { t, i18n } = useTranslation(["multiplayer", "quiz", "common"]);
  const myId = user?.sub;

  const goHome = useCallback(() => router.dismissTo("/(app)"), [router]);

  const onReveal = (reveal: GameReveal) => {
    const mine = reveal.results.find((r) => r.userId === myId);
    if (mine?.answerIndex == null) return;
    Haptics.notificationAsync(
      mine.isCorrect
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );
  };

  const {
    lobby,
    phase,
    question,
    deadline,
    myAnswerIndex,
    answerRejected,
    answeredUserIds,
    reveal,
    scores,
    joinError,
    canceledReason,
    answer,
    leave,
  } = useLiveGame(gameId, { onReveal, onEnd });

  function onEnd(end: GameEnd) {
    storeGameResult(queryClient, gameId, {
      end,
      difficulty: lobby?.difficulty ?? null,
    });
    // L'XP a bougé (barre de niveau) et la partie n'est plus active
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ACTIVE_GAME_KEY });
    router.replace({ pathname: "/results/[gameId]", params: { gameId } });
  }

  const secondsLeft = useCountdown(deadline, QUESTION_SECONDS);

  useEffect(() => {
    if (!joinError) return;
    showAlert(
      t("common:errors.title"),
      getSocketErrorMessage(joinError),
      [{ text: t("common:ok"), onPress: goHome }],
      { cancelable: false },
    );
  }, [joinError, showAlert, goHome, t]);

  useEffect(() => {
    if (!canceledReason) return;
    showAlert(
      t("canceled.title"),
      t(`canceled.${canceledReason}`),
      [{ text: t("common:ok"), onPress: goHome }],
      { cancelable: false },
    );
  }, [canceledReason, showAlert, goHome, t]);

  // Quitter en cours de partie = abandon : 0 XP, et pas de retour possible
  const confirmLeave = useCallback(() => {
    showAlert(t("game.leaveTitle"), t("game.leaveMessage"), [
      { text: t("game.keepPlaying"), style: "cancel" },
      {
        text: t("game.leaveConfirm"),
        style: "destructive",
        onPress: () => {
          leave();
          goHome();
        },
      },
    ]);
  }, [leave, goHome, showAlert, t]);

  useBlockBackNavigation(confirmLeave);

  const canAnswer = phase === "QUESTION" && myAnswerIndex === null;

  const { showKeyHints } = useQuizKeyboardShortcuts({
    answerCount: question?.answers.length ?? 0,
    canAnswer,
    canGoNext: false,
    onAnswer: answer,
    onNext: noop,
    onCancel: confirmLeave,
  });

  // Ceux qui jouent, dans l'ordre du serveur, avec leur présence à jour
  const players = scores
    .map((s) => lobby?.players.find((p) => p.user.id === s.userId))
    .filter((p): p is LobbyPlayer => !!p);
  const scoreByUser = Object.fromEntries(scores.map((s) => [s.userId, s.score]));

  if (!question || !lobby) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.statusText}>{t("game.loading")}</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const isRevealed = phase === "REVEAL" && reveal?.index === question.index;
  const correctIndex = isRevealed ? reveal.correctIndex : null;

  const getFeedbackState = (index: number): AnswerFeedbackState => {
    if (correctIndex === null) return null;
    if (index === correctIndex) return "correct";
    if (index === myAnswerIndex) return "wrong";
    return null;
  };

  /** Avatars de ceux qui ont choisi cette réponse, montrés à la révélation */
  const pickersOf = (index: number) =>
    isRevealed
      ? reveal.results
          .filter((r) => r.answerIndex === index)
          .map((r) => lobby.players.find((p) => p.user.id === r.userId)?.user)
          .filter((u) => !!u)
      : [];

  const statusMessage = (() => {
    if (isRevealed) {
      return question.index + 1 === question.total
        ? t("game.lastQuestion")
        : t("game.nextQuestion");
    }
    if (answerRejected) return t("game.tooLate");
    if (myAnswerIndex !== null) return t("game.waitingOthers");
    return null;
  })();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <LeaveButton onPress={confirmLeave} label={t("game.leave")} />
          <QuestionProgress total={question.total} current={question.index} />
          <View style={styles.headerSpacer} />
        </View>

        <PlayersStrip
          players={players}
          scores={scoreByUser}
          answeredUserIds={answeredUserIds}
          reveal={isRevealed ? reveal : null}
        />

        <View style={styles.timerContainer}>
          <CircularTimer
            secondsLeft={isRevealed ? 0 : secondsLeft}
            totalSeconds={QUESTION_SECONDS}
            urgent={!isRevealed && secondsLeft <= URGENT_SECONDS}
            size={96}
          />
        </View>

        <Text style={styles.metaLabel}>
          {t("quiz:session.metaLabel", {
            category: getCategoryLabelByOtdName(
              question.category,
              i18n.language,
            ).toUpperCase(),
            current: question.index + 1,
            total: question.total,
          })}
        </Text>

        <ScrollView
          style={styles.questionContainer}
          contentContainerStyle={styles.questionContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.questionText}>{question.question}</Text>
        </ScrollView>

        <View style={styles.answersContainer}>
          {question.answers.map((text, index) => {
            const feedback = getFeedbackState(index);
            const isMine = index === myAnswerIndex;
            const pickers = pickersOf(index);

            return (
              <AnswerFeedback key={index} state={feedback}>
                <Pressable
                  onPress={() => answer(index)}
                  disabled={!canAnswer}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canAnswer, selected: isMine }}
                  style={({ pressed }) => [
                    styles.answerButton,
                    isMine && !feedback && styles.selectedButton,
                    feedback === "correct" && styles.correctButton,
                    feedback === "wrong" && styles.wrongButton,
                    pressed && styles.pressed,
                  ]}
                >
                  {showKeyHints && (
                    <View style={styles.keyHint}>
                      <Text style={styles.keyHintText}>{index + 1}</Text>
                    </View>
                  )}
                  <Text
                    style={[
                      styles.answerText,
                      feedback === "correct" && styles.correctAnswerText,
                      feedback === "wrong" && styles.wrongAnswerText,
                    ]}
                  >
                    {text}
                  </Text>
                  {pickers.length > 0 && (
                    <View style={styles.pickers}>
                      {pickers.map((picker) => (
                        <Image
                          key={picker.id}
                          source={getAvatarImage(picker.avatarSlug)}
                          style={styles.pickerAvatar}
                          accessibilityLabel={picker.username}
                        />
                      ))}
                    </View>
                  )}
                  {feedback && (
                    <View
                      style={[
                        styles.statusIcon,
                        feedback === "correct"
                          ? styles.statusIconCorrect
                          : styles.statusIconWrong,
                      ]}
                    >
                      <MaterialIcons
                        name={feedback === "correct" ? "check" : "close"}
                        size={16}
                        color={Colors.white}
                      />
                    </View>
                  )}
                </Pressable>
              </AnswerFeedback>
            );
          })}
        </View>

        {/* Hauteur réservée : le texte qui apparaît ne doit pas décaler les réponses */}
        <View style={styles.statusLine}>
          {statusMessage && (
            <Text style={styles.statusText}>{statusMessage}</Text>
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
    gap: Spacing.md,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingTop: Spacing.md,
    marginBottom: Spacing.base,
  },
  headerSpacer: {
    width: LEAVE_BUTTON_SIZE,
  },
  timerContainer: {
    alignItems: "center",
    marginVertical: Spacing.base,
  },
  metaLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.primary,
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  questionContainer: {
    flex: 1,
  },
  questionContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Spacing.base,
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
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    minHeight: 56,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.8,
  },
  selectedButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryContainer,
  },
  correctButton: {
    backgroundColor: Colors.successContainer,
    borderColor: Colors.success,
  },
  wrongButton: {
    backgroundColor: Colors.errorContainer,
    borderColor: Colors.error,
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
  correctAnswerText: {
    color: Colors.onSuccessContainer,
  },
  wrongAnswerText: {
    color: Colors.onErrorContainer,
  },
  pickers: {
    flexDirection: "row",
    marginLeft: Spacing.sm,
  },
  // Avatars serrés qui se chevauchent légèrement, cerclés de blanc
  pickerAvatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.surface,
    marginLeft: -6,
    backgroundColor: Colors.surface,
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
  statusLine: {
    height: 32,
    justifyContent: "center",
  },
  statusText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
});
