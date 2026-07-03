import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { LeaderboardEntry } from "@/src/services/leaderboard/leaderboard.api";
import { Image, StyleSheet, Text, View } from "react-native";

export const MEDAL = {
  0: { bg: "#FFD700", border: "#FFD700", size: 80, barHeight: 120 },
  1: { bg: "#C0C0C0", border: "#C0C0C0", size: 64, barHeight: 80 },
  2: { bg: "#CD7F32", border: "#CD7F32", size: 64, barHeight: 60 },
} as const;

export interface PodiumColumnProps {
  entry: LeaderboardEntry | undefined;
  rank: 0 | 1 | 2;
  isSelf: boolean;
}

export function PodiumColumn({ entry, rank, isSelf }: PodiumColumnProps) {
  const medal = MEDAL[rank];
  const isFirst = rank === 0;

  if (!entry) {
    return (
      <View style={[styles.col, { alignItems: "center" }]}>
        <View
          style={[
            styles.bar,
            {
              height: medal.barHeight,
              backgroundColor: Colors.surfaceContainerHigh,
              opacity: 0.4,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View style={[styles.col, isFirst && styles.colFirst]}>
      <View style={styles.avatarWrapper}>
        <Image
          source={getAvatarImage(entry.userData.avatarSlug)}
          style={[
            styles.avatar,
            {
              width: medal.size,
              height: medal.size,
              borderRadius: medal.size / 2,
              borderColor: medal.border,
            },
          ]}
        />
        <View style={[styles.badge, { backgroundColor: medal.bg }]}>
          <Text style={styles.badgeText}>{rank + 1}</Text>
        </View>
      </View>
      <View
        style={[
          styles.bar,
          {
            height: medal.barHeight,
            backgroundColor: isFirst
              ? Colors.primaryContainer
              : Colors.surfaceContainerHigh,
            borderWidth: isSelf ? 2 : 0,
            borderColor: Colors.primary,
          },
        ]}
      >
        <Text style={styles.name} numberOfLines={1}>
          {entry.userData.username}
        </Text>
        <Text style={[styles.score, isFirst && styles.scoreFirst]}>
          {entry.value} pts
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    flex: 1,
    alignItems: "center",
  },
  colFirst: {
    marginBottom: 0,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: Spacing.sm,
  },
  avatar: {
    borderWidth: 3,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  badgeText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.labelSm,
    color: "#ffffff",
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xs,
    gap: 2,
  },
  name: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurface,
    textAlign: "center",
  },
  score: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.labelMd,
    color: Colors.primary,
  },
  scoreFirst: {
    fontSize: FontSize.titleSm,
  },
});
