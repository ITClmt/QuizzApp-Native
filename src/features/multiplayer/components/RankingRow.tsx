import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import type { RankedPlayer } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

interface RankingRowProps {
  player: RankedPlayer;
  isMe: boolean;
}

/**
 * Une ligne du classement final. Les gagnants (plusieurs en cas d'égalité) ont
 * la coupe ; un abandon n'a pas de rang et reste grisé en bas.
 */
export function RankingRow({ player, isMe }: RankingRowProps) {
  const { t } = useTranslation("multiplayer");
  const { user, rank, score, abandoned, isWinner } = player;

  return (
    <View style={[styles.row, isMe && styles.rowMe, abandoned && styles.dimmed]}>
      <Text style={[styles.rank, isWinner && styles.rankWinner]}>
        {rank ?? "–"}
      </Text>
      <Image source={getAvatarImage(user.avatarSlug)} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.username} numberOfLines={1}>
          {isMe ? t("results.you", { username: user.username }) : user.username}
        </Text>
        <Text style={styles.detail}>
          {abandoned
            ? t("results.abandoned")
            : t("results.correctAnswers", { count: score })}
        </Text>
      </View>
      {isWinner && (
        <MaterialIcons
          name="emoji-events"
          size={26}
          color={Colors.gold}
          accessibilityLabel={t("results.winnerLabel")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: "transparent",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  // Ma ligne : l'état se lit sur la bordure, comme partout ailleurs
  rowMe: {
    borderColor: Colors.primary,
  },
  dimmed: {
    opacity: 0.5,
  },
  rank: {
    width: 24,
    textAlign: "center",
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.titleLg,
    color: Colors.onSurfaceVariant,
  },
  rankWinner: {
    color: Colors.primary,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  info: {
    flex: 1,
  },
  username: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  detail: {
    marginTop: 2,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
});
