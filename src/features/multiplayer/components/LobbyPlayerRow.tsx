import { FriendRow, RowTag } from "@/src/features/friends/components/FriendRow";
import type { LobbyPlayer } from "@/src/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

/**
 * Un joueur du salon. Grisé s'il n'est pas (ou plus) là : invité qui n'a pas
 * encore rejoint, parti, ou déconnecté — l'étiquette dit lequel.
 */
export function LobbyPlayerRow({ player }: { player: LobbyPlayer }) {
  const { t } = useTranslation("multiplayer");
  const isHere = player.status === "JOINED" && player.connected;

  let label: string;
  if (player.isHost) label = t("lobby.host");
  else if (player.status === "JOINED" && !player.connected) {
    label = t("lobby.offline");
  } else label = t(`lobby.status.${player.status}`);

  return (
    <View style={!isHere && styles.dimmed}>
      <FriendRow user={player.user}>
        <RowTag label={label} />
      </FriendRow>
    </View>
  );
}

const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.5,
  },
});
