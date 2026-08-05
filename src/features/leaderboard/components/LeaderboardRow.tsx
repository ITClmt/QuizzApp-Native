import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import type { LeaderboardEntry } from "@/src/services/leaderboard/leaderboard.api";
import { Image, StyleSheet, Text, View } from "react-native";

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  rank: number;
  isSelf: boolean;
  unit?: string;
}

export function LeaderboardRow({
  entry,
  rank,
  isSelf,
  unit = "pts",
}: LeaderboardRowProps) {
  return (
    <View style={[styles.row, isSelf && styles.rowSelf]}>
      <Text style={[styles.rank, isSelf && styles.rankSelf]}>{rank}</Text>
      <Image
        source={getAvatarImage(entry.userData.avatarSlug)}
        style={[styles.avatar, isSelf && styles.avatarSelf]}
      />
      <View style={styles.info}>
        <Text style={[styles.name, isSelf && styles.nameSelf]}>
          {isSelf ? `You (${entry.userData.username})` : entry.userData.username}
        </Text>
      </View>
      <Text style={[styles.score, isSelf && styles.scoreSelf]}>
        {entry.value} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  rowSelf: {
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Shadows.elevated,
  },
  rank: {
    width: 28,
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  rankSelf: {
    color: Colors.onPrimaryContainer,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: Spacing.sm,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  avatarSelf: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  nameSelf: {
    color: Colors.onPrimaryContainer,
    fontFamily: FontFamily.bodyBold,
  },
  score: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.primary,
  },
  scoreSelf: {
    color: Colors.onPrimaryContainer,
  },
});
