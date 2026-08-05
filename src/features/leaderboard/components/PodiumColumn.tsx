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
  0: {
    bg: Colors.gold,
    border: Colors.gold,
    badgeBg: Colors.primary,
    barBg: Colors.primaryContainer,
    size: 80,
    barHeight: 120,
  },
  1: {
    bg: Colors.silver,
    border: Colors.silver,
    badgeBg: Colors.silverDim,
    barBg: Colors.surface,
    size: 64,
    barHeight: 80,
  },
  2: {
    bg: Colors.bronze,
    border: Colors.bronze,
    badgeBg: Colors.accentOrange,
    barBg: Colors.surface,
    size: 64,
    barHeight: 60,
  },
} as const;

export interface PodiumColumnProps {
  entry: LeaderboardEntry | undefined;
  rank: 0 | 1 | 2;
  isSelf: boolean;
  unit?: string;
}

export function PodiumColumn({
  entry,
  rank,
  isSelf,
  unit = "pts",
}: PodiumColumnProps) {
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
        <View style={[styles.badge, { backgroundColor: medal.badgeBg }]}>
          <Text style={styles.badgeText}>{rank + 1}</Text>
        </View>
      </View>
      <View
        style={[
          styles.bar,
          {
            height: medal.barHeight,
            backgroundColor: medal.barBg,
            borderWidth: isSelf ? 2 : 0,
            borderColor: Colors.primary,
          },
        ]}
      >
        <Text style={styles.name} numberOfLines={1}>
          {entry.userData.username}
        </Text>
        <Text style={[styles.score, isFirst && styles.scoreFirst]}>
          {entry.value} {unit}
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
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  badgeText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.labelSm,
    color: Colors.white,
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
