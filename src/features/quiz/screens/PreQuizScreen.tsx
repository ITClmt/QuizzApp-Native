import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import {
  type QuizCategory,
  getQuizCategories,
} from "@/src/services/quiz/quiz.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PreQuizScreen() {
  const router = useRouter();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null,
  );

  const { data: categories } = useQuery<QuizCategory[]>({
    queryKey: ["quiz-categories"],
    queryFn: getQuizCategories,
    refetchOnWindowFocus: false,
  });

  const handleDifficulty = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
      return;
    }

    setSelectedDifficulty(difficulty);
  };

  const handleCategory = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      return;
    }

    setSelectedCategory(categoryId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Difficulty</Text>

        <View style={styles.difficultiesContainer}>
          <Button
            variant={selectedDifficulty === "easy" ? "outlined" : "secondary"}
            title="easy"
            onPress={() => handleDifficulty("easy")}
            style={styles.difficultyBtn}
          />
          <Button
            variant={selectedDifficulty === "medium" ? "outlined" : "secondary"}
            title="medium"
            onPress={() => handleDifficulty("medium")}
            style={styles.difficultyBtn}
          />
          <Button
            variant={selectedDifficulty === "hard" ? "outlined" : "secondary"}
            title="hard"
            onPress={() => handleDifficulty("hard")}
            style={styles.difficultyBtn}
          />
        </View>

        <Text style={[styles.title, styles.categoryTitle]}>
          Select Category
        </Text>

        <View style={styles.categoriesContainer}>
          {categories
            ?.filter((category) => category.unlocked)
            .map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "outlined" : "secondary"
                }
                title={category.name}
                onPress={() => handleCategory(category.id)}
                style={styles.categoryBtn}
              />
            ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            You have 2 minutes to answer 50 questions.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          variant="primary"
          title="Start Quiz"
          onPress={() => {
            const params: Record<string, string> = {};
            if (selectedDifficulty) params.difficulty = selectedDifficulty;
            if (selectedCategory) params.category = selectedCategory;

            router.replace({
              pathname: "/(quiz)/quiz",
              params,
            });
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    marginBottom: Spacing["2xl"],
    textAlign: "center",
  },
  timerContainer: {
    marginTop: Spacing["2xl"],
  },
  timerText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.bodyLg,
    color: Colors.onBackground,
    textAlign: "center",
  },
  difficultiesContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  difficultyBtn: {
    flex: 1,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.md, // Écrase le Radius.full par défaut du composant Button pour un effet moins "pilule"
  },
  categoryTitle: {
    marginTop: Spacing.xl,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  categoryBtn: {
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
