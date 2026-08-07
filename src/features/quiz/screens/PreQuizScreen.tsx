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
import { getCategoryLabelById } from "@/src/constants/categories";
import {
  type QuizCategory,
  getQuizCategories,
} from "@/src/services/quiz/quiz.api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DIFFICULTIES: { value: string; color: string }[] = [
  { value: "easy", color: Colors.success },
  { value: "medium", color: Colors.secondary },
  { value: "hard", color: Colors.error },
];

export default function PreQuizScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation("quiz");
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
          <Text style={styles.title}>{t("preQuiz.selectDifficulty")}</Text>

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
                    {t(`difficulty.${d.value}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.title, styles.categoryTitle]}>
            {t("preQuiz.selectCategory")}
          </Text>

          <ScrollView
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesGrid}
            showsVerticalScrollIndicator={false}
          >
            {categories
              ?.filter((category) => category.unlocked)
              .map((category) => {
                const active = selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategory(category.id)}
                    style={[styles.categoryCard, active && styles.categoryCardActive]}
                  >
                    <Text
                      style={styles.categoryName}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {getCategoryLabelById(category.id, i18n.language)}
                    </Text>
                  </Pressable>
                );
              })}
          </ScrollView>

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{t("preQuiz.timerNotice")}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            variant="primary"
            title={t("preQuiz.startQuiz")}
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
  categoriesScroll: {
    flexGrow: 0,
    maxHeight: 260,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  categoryCard: {
    width: "31%",
    flexDirection: "column",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    ...Shadows.card,
  },
  categoryCardActive: {
    borderColor: Colors.primary,
  },
  categoryName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodySm,
    color: Colors.onSurface,
    textAlign: "center",
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
