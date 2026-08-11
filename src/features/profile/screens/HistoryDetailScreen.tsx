import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import AnswerBreakdown from "@/src/features/quiz/components/AnswerBreakdown";
import { getQuizHistoryDetail } from "@/src/services/quiz/quiz.api";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
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
import { useGameLabels } from "../hooks/useGameLabels";

export default function HistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation("quiz");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["history-detail", id],
    queryFn: () => getQuizHistoryDetail(id as string),
    enabled: !!id,
  });

  const { difficultyLabel, categoryLabel } = useGameLabels(
    data?.difficulty ?? null,
    data?.category ?? null,
  );
  const date = data
    ? new Date(data.createdAt).toLocaleDateString(i18n.language, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.navigate("/(app)/profile")}
            style={styles.backButton}
            accessibilityRole="button"
          >
            <MaterialIcons
              name="arrow-back"
              size={22}
              color={Colors.onSurface}
            />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isError || !data ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{t("history.detail.loadError")}</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.summaryCard}>
              <View style={styles.summaryInfo}>
                <Text style={styles.category} numberOfLines={1}>
                  {categoryLabel}
                </Text>
                <Text style={styles.meta}>
                  {difficultyLabel} · {date}
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreBadgeText}>
                  {data.correctCount}/{data.totalQuestions}
                </Text>
              </View>
            </View>

            <AnswerBreakdown rows={data.answers} />
          </ScrollView>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  summaryInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  category: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  meta: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },
  scoreBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
  },
  scoreBadgeText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.onPrimaryContainer,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.error,
  },
});
