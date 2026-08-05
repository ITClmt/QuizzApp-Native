import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import {
  type QuizCategory,
  getQuizCategories,
} from "@/src/services/quiz/quiz.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORY_ACCENTS = [
  Colors.success,
  Colors.accentOrange,
  Colors.primary,
  Colors.secondary,
  Colors.accentPink,
  Colors.tertiary,
];

const DIFFICULTIES: { value: string; label: string; color: string }[] = [
  { value: "easy", label: "Easy", color: Colors.success },
  { value: "medium", label: "Medium", color: Colors.secondary },
  { value: "hard", label: "Hard", color: Colors.error },
];

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
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Select Difficulty</Text>

          <View style={styles.difficultiesContainer}>
            {DIFFICULTIES.map((d) => {
              const active = selectedDifficulty === d.value;
              return (
                <Pressable
                  key={d.value}
                  onPress={() => handleDifficulty(d.value)}
                  style={[
                    styles.difficultyPill,
                    active && {
                      backgroundColor: d.color,
                      borderColor: d.color,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.difficultyText,
                      { color: active ? Colors.white : d.color },
                    ]}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.title, styles.categoryTitle]}>
            Select Category
          </Text>

          <View style={styles.categoriesGrid}>
            {categories
              ?.filter((category) => category.unlocked)
              .map((category, index) => {
                const active = selectedCategory === category.id;
                const accent = CATEGORY_ACCENTS[index % CATEGORY_ACCENTS.length];
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategory(category.id)}
                    style={[styles.categoryCard, active && styles.categoryCardActive]}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: accent }]}>
                      <Text style={styles.categoryIconText}>
                        {category.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>
                      {category.name}
                    </Text>
                  </Pressable>
                );
              })}
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>
              You have 1 minute 30 to answer 50 questions.
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
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: Spacing.xl,
    textAlign: "center",
  },
  timerContainer: {
    marginTop: Spacing.xl,
  },
  timerText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  difficultiesContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  difficultyPill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  difficultyText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
  },
  categoryTitle: {
    marginTop: Spacing.xl,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  categoryCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
    padding: Spacing.md,
    ...Shadows.card,
  },
  categoryCardActive: {
    borderColor: Colors.primary,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleMd,
    color: Colors.white,
  },
  categoryName: {
    flex: 1,
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurface,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
