import { Spacing } from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import AnswerBreakdown from "@/src/features/quiz/components/AnswerBreakdown";
import DifficultyBreakdown from "@/src/features/quiz/components/DifficultyBreakdown";
import ResultsActions from "@/src/features/quiz/components/ResultsActions";
import ScoreSummary from "@/src/features/quiz/components/ScoreSummary";
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
          <DifficultyBreakdown details={result.details} />
          {result.answers.length > 0 && (
            <AnswerBreakdown
              answers={result.answers}
              questionMap={questionMap}
              userAnswers={userAnswers}
            />
          )}
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
