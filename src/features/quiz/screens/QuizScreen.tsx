import { Colors, Spacing } from "@/constants/theme";
import CancelSessionButton from "@/src/features/quiz/components/CancelSessionButton";
import { startQuizSession } from "@/src/services/quiz/quiz.api";
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

export default function QuizScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

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

  // Déclenche le call API une seule fois, dès que le composant est monté
  useEffect(() => {
    startSession();
  }, []);

  // --- États de l'UI ---

  if (isPending) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
        <Text>Starting your session...</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Error: {error.message}</Text>
      </SafeAreaView>
    );
  }

  // Guard : questions pas encore peuplées (flash entre isPending=false et onSuccess)
  if (questions.length === 0) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // A partir d'ici, questions[currentQuestionIndex] est garanti défini
  const currentQuestion = questions[currentQuestionIndex];

  // --- UI principale (une fois la session chargée) ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header custom avec bouton annulation */}
      <View style={styles.header}>
        <CancelSessionButton sessionId={data!.sessionId} />
      </View>

      <View style={styles.content}>
        {/* Question */}
        <Text style={styles.questionText}>{currentQuestion.questionEn}</Text>

        {/* Réponse */}
        {currentQuestion.answers.map((answer, index) => (
          <Pressable key={index} style={styles.answerButton} onPress={() => {}}>
            <Text style={styles.answerText}>{answer}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
  },
  progressText: {
    color: Colors.onSurfaceVariant,
  },
  content: {
    flex: 1,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.onSurface,
    marginBottom: Spacing["2xl"],
  },
  answerButton: {
    padding: Spacing.lg,
    borderRadius: Spacing.md,
    backgroundColor: Colors.surfaceContainerHigh,
    marginBottom: Spacing.md,
  },
  answerText: {
    fontSize: 18,
    color: Colors.onSurface,
  },
});
