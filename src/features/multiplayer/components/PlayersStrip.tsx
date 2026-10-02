import { getAvatarImage } from "@/constants/avatars";
import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import type { GameReveal, LobbyPlayer } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

interface PlayersStripProps {
  /** Joueurs de la partie, dans l'ordre des scores du serveur */
  players: LobbyPlayer[];
  scores: Record<string, number>;
  answeredUserIds: string[];
  /** Présente pendant la révélation : la pastille dit juste ou faux */
  reveal: GameReveal | null;
}

type Badge = "answered" | "correct" | "wrong" | null;

/**
 * Les joueurs en haut de l'écran de partie. Pendant la question, l'avatar
 * s'allume quand le joueur a répondu (jamais ce qu'il a répondu) ; à la
 * révélation, la pastille passe au vert ou au rouge. Score en dessous.
 */
export function PlayersStrip({
  players,
  scores,
  answeredUserIds,
  reveal,
}: PlayersStripProps) {
  const { t } = useTranslation("multiplayer");

  return (
    <View style={styles.strip}>
      {players.map((player) => {
        const { id, username, avatarSlug } = player.user;
        const left = player.status === "LEFT";
        const away = left || !player.connected;

        const result = reveal?.results.find((r) => r.userId === id);
        let badge: Badge = null;
        if (result) badge = result.isCorrect ? "correct" : "wrong";
        else if (!reveal && answeredUserIds.includes(id)) badge = "answered";

        let label = t("game.playerWaiting", { username });
        if (left) label = t("game.playerLeft", { username });
        else if (!player.connected) label = t("game.playerOffline", { username });
        else if (badge === "answered") label = t("game.playerAnswered", { username });

        return (
          <View
            key={id}
            style={[styles.player, away && styles.away]}
            accessible
            accessibilityLabel={label}
          >
            <View
              style={[
                styles.ring,
                badge === "answered" && styles.ringAnswered,
                badge === "correct" && styles.ringCorrect,
                badge === "wrong" && styles.ringWrong,
              ]}
            >
              <Image source={getAvatarImage(avatarSlug)} style={styles.avatar} />
              {badge && (
                <View
                  style={[
                    styles.badge,
                    badge === "answered" && styles.badgeAnswered,
                    badge === "correct" && styles.badgeCorrect,
                    badge === "wrong" && styles.badgeWrong,
                  ]}
                >
                  <MaterialIcons
                    name={badge === "wrong" ? "close" : "check"}
                    size={12}
                    color={Colors.white}
                  />
                </View>
              )}
            </View>
            <Text style={styles.name} numberOfLines={1}>
              {username}
            </Text>
            <Text style={styles.score}>{scores[id] ?? 0}</Text>
          </View>
        );
      })}
    </View>
  );
}

const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
  strip: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.base,
  },
  player: {
    width: 64,
    alignItems: "center",
  },
  away: {
    opacity: 0.4,
  },
  // L'état se lit sur la bordure de 2 px, l'ombre ne bouge pas
  ring: {
    padding: 2,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  ringAnswered: {
    borderColor: Colors.primary,
  },
  ringCorrect: {
    borderColor: Colors.success,
  },
  ringWrong: {
    borderColor: Colors.error,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.full,
  },
  badge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeAnswered: {
    backgroundColor: Colors.primary,
  },
  badgeCorrect: {
    backgroundColor: Colors.success,
  },
  badgeWrong: {
    backgroundColor: Colors.error,
  },
  name: {
    marginTop: Spacing.xs,
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelMd,
    color: Colors.onSurfaceVariant,
  },
  score: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.titleLg,
    color: Colors.onSurface,
  },
});
