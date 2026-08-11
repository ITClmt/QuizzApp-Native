import { Spacing } from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import AnswerBreakdown from "@/src/features/quiz/components/AnswerBreakdown";
import DifficultyBreakdown from "@/src/features/quiz/components/DifficultyBreakdown";
import ResultsActions from "@/src/features/quiz/components/ResultsActions";
import ScoreSummary from "@/src/features/quiz/components/ScoreSummary";
import UnlockedAvatars from "@/src/features/quiz/components/UnlockedAvatars";
import UnlockedCategories from "@/src/features/quiz/components/UnlockedCategories";
import XpSummary from "@/src/features/quiz/components/XpSummary";
import type { QuizQuestion, QuizResult } from "@/src/types";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  if (!resultParam || !questionsParam || !userAnswersParam) {
    return <Redirect href="/(app)" />;
  }

  const result = JSON.parse(resultParam) as QuizResult;
  const questions = JSON.parse(questionsParam) as QuizQuestion[];
  const userAnswers = JSON.parse(userAnswersParam) as number[];

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const answerRows = result.answers.map((answer, index) => {
    const question = questionMap.get(answer.questionId);
    return {
      questionId: answer.questionId,
      questionText: question?.question,
      isCorrect: answer.isCorrect,
      userAnswerText: question?.answers[userAnswers[index]],
      correctAnswerText: answer.correctAnswer,
    };
  });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <ScoreSummary score={result.totalScore} total={result.answers.length} />
          <XpSummary
            xpEarned={result.xpEarned}
            level={result.level}
            leveledUp={result.leveledUp}
          />
          <UnlockedCategories categoryIds={result.unlockedCategoryIds ?? []} />
          <UnlockedAvatars slugs={result.unlockedAvatarSlugs ?? []} />
          <DifficultyBreakdown details={result.details} />
          {answerRows.length > 0 && <AnswerBreakdown rows={answerRows} />}
        </ScrollView>

        <ResultsActions
          onReplay={() => router.replace("/(quiz)/preQuiz")}
          onHome={() => router.replace("/(app)")}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing["2xl"],
  },
});
