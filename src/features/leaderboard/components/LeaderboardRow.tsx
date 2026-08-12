import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from "@/constants/theme";
import type { LeaderboardEntry } from "@/src/services/leaderboard/leaderboard.api";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("leaderboard");
  return (
    <View style={[styles.row, isSelf && styles.rowSelf]} accessible>
      <Text style={[styles.rank, isSelf && styles.rankSelf]}>{rank}</Text>
      <View style={[styles.avatarRing, isSelf && styles.avatarRingSelf]}>
        <Image
          source={getAvatarImage(entry.userData.avatarSlug)}
          style={styles.avatar}
        />
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, isSelf && styles.nameSelf]}>
          {isSelf
            ? t("you", { username: entry.userData.username })
            : entry.userData.username}
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
  // Le fond blanc + le padding évitent que le dessin (ex. la lune d'Epic_Spacey)
  // ne touche le bord du cercle une fois détouré.
  avatarRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: Spacing.sm,
    padding: 3,
    backgroundColor: Colors.white,
  },
  avatarRingSelf: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: Radius.full,
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
