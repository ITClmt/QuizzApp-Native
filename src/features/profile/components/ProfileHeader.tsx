import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { LevelProgressBar } from "@/src/components/LevelProgressBar";
import type { Difficulty } from "@/src/services/leaderboard/leaderboard.api";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DifficultyScoreCard } from "./DifficultyScoreCard";
import { ProfileTabSwitcher, type ProfileTab } from "./ProfileTabSwitcher";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

interface ProfileHeaderProps {
  avatarSlug?: string;
  username?: string;
  totalScore: number;
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
  scoreByDifficulty: Map<Difficulty, number>;
  isScoresLoading: boolean;
  isScoresError: boolean;
  onRetryScores: () => void;
}

export function ProfileHeader({
  avatarSlug,
  username,
  totalScore,
  activeTab,
  onChangeTab,
  scoreByDifficulty,
  isScoresLoading,
  isScoresError,
  onRetryScores,
}: ProfileHeaderProps) {
  const { t } = useTranslation("profile");
  const maxValue = Math.max(
    1,
    ...DIFFICULTIES.map((d) => scoreByDifficulty.get(d) ?? 0),
  );

  return (
    <View>
      <View style={styles.hero}>
        <Pressable
          style={styles.avatarRing}
          onPress={() => router.push("/(app)/avatars")}
          accessibilityRole="button"
          accessibilityLabel={t("avatars.change")}
        >
          <Image source={getAvatarImage(avatarSlug)} style={styles.avatar} />
          <View style={styles.avatarEditBadge}>
            <MaterialIcons name="edit" size={14} color={Colors.onPrimary} />
          </View>
        </Pressable>
        <Text style={styles.username} numberOfLines={1}>
          {username}
        </Text>
      </View>

      <View style={styles.totalScoreCard}>
        <Text style={styles.totalScoreLabel}>{t("totalScore")}</Text>
        <Text style={styles.totalScoreValue}>{totalScore}</Text>
      </View>

      <View style={styles.levelCardWrapper}>
        <LevelProgressBar />
      </View>

      <View style={styles.tabSwitcherWrapper}>
        <ProfileTabSwitcher activeTab={activeTab} onChange={onChangeTab} />
      </View>

      {activeTab === "scores" &&
        (isScoresLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : isScoresError ? (
          <ErrorNotice message={t("loadError")} onRetry={onRetryScores} />
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
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
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
  avatarEditBadge: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
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
  tabSwitcherWrapper: {
    marginBottom: Spacing.xl,
  },
  scoreList: {
    gap: Spacing.md,
  },
  centered: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
});
