import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { BACK_BUTTON_SIZE, BackButton } from "@/src/components/BackButton";
import { Button } from "@/src/components/Button";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { getCategoryLabelById } from "@/src/constants/categories";
import {
  type QuizCategory,
  type QuizQuota,
  getQuizCategories,
  getQuizQuota,
} from "@/src/services/quiz/quiz.api";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const QUOTA_TICK_MS = 30 * 1000;

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

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useQuery<QuizCategory[]>({
    queryKey: ["quiz-categories"],
    queryFn: getQuizCategories,
    refetchOnWindowFocus: false,
  });

  const { data: quota, refetch: refetchQuota } = useQuery<QuizQuota>({
    queryKey: ["quiz-quota"],
    queryFn: getQuizQuota,
  });
  const nextGameAt = quota?.nextGameAt
    ? new Date(quota.nextGameAt).getTime()
    : null;
  const [now, setNow] = useState(() => Date.now());

  // Rafraîchit le compte à rebours, puis le quota quand une partie revient
  useEffect(() => {
    if (nextGameAt === null) return;
    const interval = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= nextGameAt) refetchQuota();
    }, QUOTA_TICK_MS);
    return () => clearInterval(interval);
  }, [nextGameAt, refetchQuota]);

  const isLimitReached = quota?.remaining === 0;
  const isQuotaFull = quota !== undefined && quota.remaining === quota.limit;

  const formatWait = () => {
    const totalMinutes = Math.max(
      1,
      Math.ceil(((nextGameAt ?? now) - now) / 60000),
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0
      ? t("preQuiz.waitHours", {
          hours,
          minutes: String(minutes).padStart(2, "0"),
        })
      : t("preQuiz.waitMinutes", { minutes });
  };

  const handleDifficulty = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
      return;
    }

    setSelectedDifficulty(difficulty);
  };

  // Unlocked first, then the locked ones ordered by how soon they unlock
  const sortedCategories = [...(categories ?? [])].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return a.unlockLevel - b.unlockLevel;
  });

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
          <View style={styles.titleRow}>
            <BackButton fallbackHref="/(app)" />
            <Text style={[styles.title, styles.titleInRow]}>
              {t("preQuiz.selectDifficulty")}
            </Text>
            {/* Contrepoids du bouton, pour garder le titre centré */}
            <View style={styles.titleSpacer} />
          </View>

          <View style={styles.difficultiesContainer}>
            {DIFFICULTIES.map((d) => {
              const active = selectedDifficulty === d.value;
              return (
                <Pressable
                  key={d.value}
                  onPress={() => handleDifficulty(d.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [
                    styles.difficultyPill,
                    active && {
                      backgroundColor: d.color,
                      borderColor: d.color,
                    },
                    pressed && styles.pressed,
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

          {isCategoriesLoading ? (
            <View style={styles.categoriesFallback}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : isCategoriesError ? (
            <View style={styles.categoriesFallback}>
              <ErrorNotice
                message={t("preQuiz.categoriesLoadError")}
                onRetry={refetchCategories}
              />
            </View>
          ) : (
          <ScrollView
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesGrid}
            showsVerticalScrollIndicator={false}
          >
            {sortedCategories.map((category) => {
              const active = selectedCategory === category.id;
              const label = getCategoryLabelById(category.id, i18n.language);

              if (!category.unlocked) {
                return (
                  <View
                    key={category.id}
                    style={[styles.categoryCard, styles.categoryCardLocked]}
                    accessible
                    accessibilityLabel={t("preQuiz.categoryLocked", {
                      category: label,
                      level: category.unlockLevel,
                    })}
                  >
                    <Text
                      style={[styles.categoryName, styles.categoryNameLocked]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {label}
                    </Text>
                    <View style={styles.lockRow}>
                      <MaterialIcons
                        name="lock"
                        size={12}
                        color={Colors.outline}
                      />
                      <Text style={styles.categoryUnlockLevel}>
                        {t("preQuiz.unlockAtLevel", {
                          level: category.unlockLevel,
                        })}
                      </Text>
                    </View>
                  </View>
                );
              }

              return (
                <Pressable
                  key={category.id}
                  onPress={() => handleCategory(category.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={label}
                  style={({ pressed }) => [
                    styles.categoryCard,
                    active && styles.categoryCardActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={styles.categoryName}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.8}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          )}

          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{t("preQuiz.timerNotice")}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          {quota && (
            <View style={styles.quotaRow}>
              <MaterialIcons
                name="bolt"
                size={16}
                color={isLimitReached ? Colors.error : Colors.primary}
              />
              <Text
                style={[styles.quotaText, isLimitReached && styles.quotaTextEmpty]}
              >
                {t("preQuiz.gamesRemaining", {
                  remaining: quota.remaining,
                  limit: quota.limit,
                })}
              </Text>
              {/* À 0, le bouton affiche déjà l'attente */}
              {!isLimitReached && (
                <Text style={styles.quotaHint}>
                  {isQuotaFull
                    ? t("preQuiz.quotaRule", { hours: quota.windowHours })
                    : t("preQuiz.nextGameRecovered", { time: formatWait() })}
                </Text>
              )}
            </View>
          )}
          <Button
            variant="primary"
            title={
              isLimitReached
                ? t("preQuiz.nextGameIn", { time: formatWait() })
                : t("preQuiz.startQuiz")
            }
            disabled={isLimitReached}
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  titleSpacer: {
    width: BACK_BUTTON_SIZE,
  },
  titleInRow: {
    flex: 1,
    marginBottom: 0,
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
  quotaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  quotaText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodySm,
    color: Colors.onSurfaceVariant,
  },
  quotaHint: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodySm,
    color: Colors.outline,
  },
  quotaTextEmpty: {
    color: Colors.error,
  },
  difficultiesContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  difficultyPill: {
    flex: 1,
    minHeight: 48,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
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
  categoriesFallback: {
    height: 260,
    justifyContent: "center",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  categoryCard: {
    width: "31%",
    minHeight: 62,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
  categoryCardLocked: {
    backgroundColor: Colors.surfaceVariant,
    boxShadow: "none",
  },
  categoryName: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodySm,
    color: Colors.onSurface,
    textAlign: "center",
  },
  categoryNameLocked: {
    color: Colors.outline,
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  categoryUnlockLevel: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelMd,
    color: Colors.outline,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
});
