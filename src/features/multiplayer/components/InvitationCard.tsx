import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { RowAction } from "@/src/features/friends/components/FriendRow";
import type { GameInvitation } from "@/src/types";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";
import { DifficultyChip } from "./DifficultyChip";

interface InvitationCardProps {
  invitation: GameInvitation;
  onJoin: () => void;
  onDecline: () => void;
  disabled?: boolean;
}

/** Invitation reçue, sur l'accueil : qui invite, la partie, rejoindre / refuser */
export function InvitationCard({
  invitation,
  onJoin,
  onDecline,
  disabled,
}: InvitationCardProps) {
  const { t } = useTranslation("multiplayer");
  const { host } = invitation;

  return (
    <View style={styles.card}>
      <Image source={getAvatarImage(host.avatarSlug)} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {t("home.invitedBy", { username: host.username })}
        </Text>
        <View style={styles.meta}>
          <DifficultyChip difficulty={invitation.difficulty} />
          <Text style={styles.players}>
            {t("playersCount", { count: invitation.playerCount })}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <RowAction
          icon="close"
          tone="danger"
          label={t("home.decline", { username: host.username })}
          onPress={onDecline}
          disabled={disabled}
        />
        <RowAction
          icon="play-arrow"
          tone="primary"
          label={t("home.join", { username: host.username })}
          onPress={onJoin}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  players: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
});
