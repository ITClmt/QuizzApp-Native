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
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DifficultyScoreCard } from "./DifficultyScoreCard";
import { FirstGameCta } from "./FirstGameCta";
import { ScoresSkeleton } from "./ProfileSkeletons";
import { ProfileTabSwitcher, type ProfileTab } from "./ProfileTabSwitcher";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

interface ProfileHeaderProps {
  avatarSlug?: string;
  username?: string;
  pendingFriendRequests: number;
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
  pendingFriendRequests,
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
        <Pressable
          style={({ pressed }) => [
            styles.friendsButton,
            pressed && styles.friendsButtonPressed,
          ]}
          onPress={() => router.push("/friends")}
          accessibilityRole="button"
          accessibilityLabel={
            pendingFriendRequests > 0
              ? t("friendsButtonWithRequests", { count: pendingFriendRequests })
              : t("friendsButton")
          }
        >
          <MaterialIcons name="group" size={18} color={Colors.primary} />
          <Text style={styles.friendsButtonText}>{t("friendsButton")}</Text>
          {pendingFriendRequests > 0 && (
            <View style={styles.friendsBadge}>
              <Text style={styles.friendsBadgeText}>
                {pendingFriendRequests > 9 ? "9+" : pendingFriendRequests}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Score et niveau réunis : deux cartes séparées repoussaient les
          onglets Scores/Historique sous la ligne de flottaison. */}
      <View style={styles.statsCard}>
        <View style={styles.totalScoreRow}>
          <Text style={styles.totalScoreLabel}>{t("totalScore")}</Text>
          <Text style={styles.totalScoreValue}>{totalScore}</Text>
        </View>
        <View style={styles.statsDivider} />
        <LevelProgressBar embedded />
      </View>

      <View style={styles.tabSwitcherWrapper}>
        <ProfileTabSwitcher activeTab={activeTab} onChange={onChangeTab} />
      </View>

      {activeTab === "scores" &&
        (isScoresLoading ? (
          <ScoresSkeleton />
        ) : isScoresError ? (
          <ErrorNotice message={t("loadError")} onRetry={onRetryScores} />
        ) : totalScore === 0 ? (
          <FirstGameCta />
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
  friendsButton: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
  },
  friendsButtonPressed: {
    opacity: 0.7,
  },
  friendsButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodySm,
    color: Colors.primary,
  },
  friendsBadge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error,
  },
  friendsBadgeText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
    color: Colors.onError,
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.card,
  },
  totalScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: Spacing.md,
  },
  totalScoreLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalScoreValue: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.primary,
  },
  tabSwitcherWrapper: {
    marginBottom: Spacing.xl,
  },
  scoreList: {
    gap: Spacing.md,
  },
});
