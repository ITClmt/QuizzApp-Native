import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import type { MyRank } from "@/src/services/leaderboard/leaderboard.api";
import type { User } from "@/src/types";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

interface MyRankBannerProps {
  myRank: MyRank;
  user: User;
  unit?: string;
}

export function MyRankBanner({
  myRank,
  user,
  unit = "pts",
}: MyRankBannerProps) {
  const { t } = useTranslation("leaderboard");
  return (
    <View style={styles.wrapper}>
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>{t("yourPosition")}</Text>
        <View style={styles.separatorLine} />
      </View>

      <View style={styles.card}>
        <Text style={styles.rank}>#{myRank.rank}</Text>
        <Image
          source={getAvatarImage(user.avatarSlug)}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{t("you", { username: user.username })}</Text>
          <Text style={styles.subtitle}>{t("outsideTop10")}</Text>
        </View>
        <Text style={styles.score}>
          {myRank.value} {unit}
        </Text>
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
    marginHorizontal: Spacing.xl,
    backgroundColor: Colors.inverseSurface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.elevated,
  },
  rank: {
    width: 40,
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.inverseOnSurface,
    textAlign: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.inversePrimary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyMd,
    color: Colors.inverseOnSurface,
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.labelSm,
    color: Colors.inversePrimary,
    marginTop: 2,
  },
  score: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.inverseOnSurface,
  },
});
