import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import type { MyRank } from "@/src/services/leaderboard/leaderboard.api";
import type { User } from "@/src/types";
import { Image, StyleSheet, Text, View } from "react-native";

interface MyRankBannerProps {
  myRank: MyRank;
  user: User;
}

export function MyRankBanner({ myRank, user }: MyRankBannerProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Your position</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.card}>
        <Text style={styles.rank}>#{myRank.rank}</Text>
        <Image
          source={getAvatarImage(user.avatarSlug)}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>You ({user.username})</Text>
          <Text style={styles.subtitle}>Outside top 10</Text>
        </View>
        <Text style={styles.score}>{myRank.value} pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.outlineVariant,
    opacity: 0.5,
  },
  separatorText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing["2xl"],
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    borderStyle: "dashed",
    ...Shadows.card,
  },
  rank: {
    width: 40,
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: Spacing.sm,
    opacity: 0.8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  score: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
  },
});
