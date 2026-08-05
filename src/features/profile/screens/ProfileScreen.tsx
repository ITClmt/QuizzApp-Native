import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { getProfileRequest } from "@/src/services/auth/auth.api";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { getUserScores } from "@/src/services/score/score.api";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
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

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileRequest,
    enabled: !!user?.sub,
    refetchOnWindowFocus: false,
  });

  // React Navigation garde les écrans d'onglets montés : sans ce hook,
  // revenir sur Profile après un quiz réaffiche les données mises en cache
  // au premier montage (React Query ne rafraîchit pas au changement d'onglet).
  useFocusEffect(
    useCallback(() => {
      refetchScores();
      refetchProfile();
    }, [refetchScores, refetchProfile]),
  );

  const xpIntoLevel = profile ? profile.xp - profile.xpForCurrentLevel : 0;
  const xpForThisLevel = profile
    ? profile.xpForNextLevel - profile.xpForCurrentLevel
    : 1;
  const levelProgress = Math.min(1, xpIntoLevel / Math.max(1, xpForThisLevel));

  const scoreByDifficulty = new Map(
    data?.scores.map((s) => [s.difficulty, s.value]),
  );
  const maxValue = Math.max(
    1,
    ...DIFFICULTIES.map((d) => scoreByDifficulty.get(d) ?? 0),
  );

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.avatarRing}>
          <Image
            source={getAvatarImage(user?.avatarSlug)}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>{user?.username}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.totalScoreCard}>
          <Text style={styles.totalScoreLabel}>Total score</Text>
          <Text style={styles.totalScoreValue}>{data?.totalScore ?? 0}</Text>
        </View>

        {profile && (
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelLabel}>Level {profile.level}</Text>
              <Text style={styles.levelXpText}>
                {xpForThisLevel > 0
                  ? `${xpIntoLevel} / ${xpForThisLevel} XP`
                  : "Max level reached"}
              </Text>
            </View>
            <View style={styles.levelBarTrack}>
              <View
                style={[
                  styles.levelBarFill,
                  { width: `${levelProgress * 100}%` },
                ]}
              />
            </View>
          </View>
        )}

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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    alignItems: "center",
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing["4xl"],
    borderBottomLeftRadius: Radius["2xl"],
    borderBottomRightRadius: Radius["2xl"],
  },
  avatarRing: {
    padding: 4,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.3)",
    ...Shadows.elevated,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
  },
  username: {
    marginTop: Spacing.base,
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineSm,
    color: Colors.onPrimary,
  },
  email: {
    marginTop: Spacing.xs,
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodySm,
    color: Colors.onPrimary,
    opacity: 0.85,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    marginTop: -Spacing["3xl"],
  },
  levelCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing["2xl"],
    gap: Spacing.sm,
    ...Shadows.card,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelLabel: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
    color: Colors.onSurface,
  },
  levelXpText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },
  levelBarTrack: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  levelBarFill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
  },
  totalScoreCard: {
    alignItems: "center",
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing["2xl"],
    ...Shadows.elevated,
  },
  totalScoreLabel: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalScoreValue: {
    marginTop: Spacing.xs,
    fontFamily: FontFamily.headline,
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
