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
import { LevelProgressBar } from "@/src/components/LevelProgressBar";
import { useAuth } from "@/src/contexts/AuthContext";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { getUserScores } from "@/src/services/score/score.api";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultyScoreCard } from "../components/DifficultyScoreCard";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function ProfileScreen() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchScores,
  } = useQuery({
    queryKey: ["user-scores", user?.sub],
    queryFn: () => getUserScores(user?.sub as string),
    enabled: !!user?.sub,
    refetchOnWindowFocus: false,
  });

  // React Navigation garde les écrans d'onglets montés : sans ce hook,
  // revenir sur Profile après un quiz réaffiche les scores mis en cache
  // au premier montage (React Query ne rafraîchit pas au changement d'onglet).
  useFocusEffect(
    useCallback(() => {
      refetchScores();
    }, [refetchScores]),
  );

  const scoreByDifficulty = new Map(
    data?.scores.map((s) => [s.difficulty, s.value]),
  );
  const maxValue = Math.max(
    1,
    ...DIFFICULTIES.map((d) => scoreByDifficulty.get(d) ?? 0),
  );

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.hero}>
            <View style={styles.avatarRing}>
              <Image
                source={getAvatarImage(user?.avatarSlug)}
                style={styles.avatar}
              />
            </View>
            <Text style={styles.username}>{user?.username}</Text>
          </View>

          <View style={styles.totalScoreCard}>
            <Text style={styles.totalScoreLabel}>Total score</Text>
            <Text style={styles.totalScoreValue}>{data?.totalScore ?? 0}</Text>
          </View>

          <View style={styles.levelCardWrapper}>
            <LevelProgressBar />
          </View>

          <Text style={styles.sectionTitle}>Scores by difficulty</Text>

          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={styles.errorText}>Failed to load scores.</Text>
            </View>
          ) : (
            <View style={styles.scoreList}>
              {DIFFICULTIES.map((difficulty) => (
                <DifficultyScoreCard
                  key={difficulty}
                  difficulty={difficulty}
                  value={scoreByDifficulty.get(difficulty) ?? 0}
                  maxValue={maxValue}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"] + Spacing.xl,
  },
  hero: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatarRing: {
    padding: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadows.elevated,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
  },
  username: {
    marginTop: Spacing.base,
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineMd,
    color: Colors.onSurface,
  },
  levelCardWrapper: {
    marginBottom: Spacing.xl,
  },
  totalScoreCard: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  totalScoreLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalScoreValue: {
    marginTop: Spacing.xs,
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.displayMd,
    color: Colors.primary,
  },
  sectionTitle: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
    color: Colors.onSurface,
    marginBottom: Spacing.base,
  },
  scoreList: {
    gap: Spacing.md,
  },
  centered: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.error,
  },
});
