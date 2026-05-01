import { startQuizSession } from "@/src/services/quiz/quiz.api";
import { Colors, Spacing } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const router = useRouter();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
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
      console.error("Failed to start session:", err.message);
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
      {/* Header custom avec bouton retour */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.replace("/(app)")}
          style={styles.backButton}
          hitSlop={8} // Agrandit la zone de clic sans changer l'apparence
        >
          <MaterialIcons name="close" size={24} color={Colors.onSurface} />
        </Pressable>
        <Text style={styles.progressText}>
          {currentQuestionIndex + 1} / {questions.length}
        </Text>
      </View>

      <Text>Current question : {currentQuestion.questionEn}</Text>
      <Text>Answers: {currentQuestion.answers.join(", ")}</Text>
      <Text>Correct index: {currentQuestion.correctIndex}</Text>
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
  backButton: {
    padding: Spacing.sm, // Surface cliquable généreuse
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  progressText: {
    color: Colors.onSurfaceVariant,
  },
});
