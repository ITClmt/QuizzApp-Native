import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { GradientBackground } from "@/src/components/GradientBackground";
import {
  SegmentedControl,
  type SegmentedControlOption,
} from "@/src/components/SegmentedControl";
import { useAlert } from "@/src/contexts/AlertContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { useMultiplayer } from "@/src/contexts/MultiplayerContext";
import { useBlockBackNavigation } from "@/src/hooks/useBlockBackNavigation";
import type { GameDifficulty, LobbyPlayer } from "@/src/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultyChip } from "../components/DifficultyChip";
import { LEAVE_BUTTON_SIZE, LeaveButton } from "../components/LeaveButton";
import { LobbyPlayerRow } from "../components/LobbyPlayerRow";
import { useGameExitAlerts } from "../hooks/useGameExitAlerts";
import { useLobby } from "../hooks/useLobby";
import { getSocketErrorMessage } from "../utils/socketErrorMessage";

type DifficultyChoice = GameDifficulty | "mixed";

// Hôte d'abord, puis ceux qui sont là, puis les invités, enfin les absents
const STATUS_ORDER: Record<LobbyPlayer["status"], number> = {
  JOINED: 0,
  INVITED: 1,
  LEFT: 2,
  DECLINED: 3,
};

function sortPlayers(players: LobbyPlayer[]) {
  return [...players].sort(
    (a, b) =>
      Number(b.isHost) - Number(a.isHost) ||
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
  );
}

export default function LobbyScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { status } = useMultiplayer();
  const { showAlert } = useAlert();
  const { t } = useTranslation(["multiplayer", "quiz", "common"]);
  const {
    lobby,
    joinError,
    canceledReason,
    leave,
    start,
    setReady,
    setDifficulty,
  } = useLobby(gameId);
  const [isStarting, setIsStarting] = useState(false);
  const [isTogglingReady, setIsTogglingReady] = useState(false);

  const isHost = !!lobby && lobby.hostId === user?.sub;
  // dismissTo plutôt que replace : le salon est ouvert par-dessus l'accueil, un
  // replace empilerait un second accueil à chaque aller-retour. Ouvert sans
  // accueil dessous (lien direct, web rechargé), il le remplace.
  const goHome = useCallback(() => router.dismissTo("/(app)"), [router]);

  // Partie lancée (ou déjà en cours quand on arrive par « Partie en cours ») :
  // tout le monde passe à l'écran de partie, qui la rejoint de lui-même.
  useEffect(() => {
    if (lobby && lobby.phase !== "LOBBY") {
      router.replace({ pathname: "/game/[gameId]", params: { gameId } });
    }
  }, [lobby, gameId, router]);

  useGameExitAlerts({ joinError, canceledReason, onExit: goHome });

  // L'hôte qui part annule la partie pour tout le monde : on lui demande.
  // Un invité peut revenir tant que la partie n'est pas lancée : il part direct.
  const confirmLeave = useCallback(() => {
    const quit = () => {
      leave();
      goHome();
    };
    if (!isHost) {
      quit();
      return;
    }
    showAlert(t("lobby.leaveHostTitle"), t("lobby.leaveHostMessage"), [
      { text: t("lobby.stay"), style: "cancel" },
      { text: t("lobby.leaveHostConfirm"), style: "destructive", onPress: quit },
    ]);
  }, [isHost, leave, goHome, showAlert, t]);

  // Le retour système passe par la même sortie que la croix
  useBlockBackNavigation(confirmLeave);

  const players = sortPlayers(lobby?.players ?? []);
  const me = players.find((p) => p.user.id === user?.sub);
  const host = players.find((p) => p.isHost);
  // Les invités qui n'ont pas répondu ne comptent pas : on ne les attend pas
  const joined = players.filter((p) => p.status === "JOINED");
  // L'hôte est prêt d'office : c'est lui qui lance
  const readyCount = joined.filter((p) => p.isHost || p.ready).length;
  // Un déconnecté ne verrait pas le décompte : le serveur l'attend aussi
  const notReady = joined.filter(
    (p) => !p.isHost && (!p.ready || !p.connected),
  );
  const hasEnoughPlayers = !!lobby && joined.length >= lobby.minPlayers;
  const isConnected = status === "connected";

  const canStart =
    isHost && hasEnoughPlayers && notReady.length === 0 && isConnected;

  const showError = (code: string) =>
    showAlert(t("common:errors.title"), getSocketErrorMessage(code));

  const handleStart = async () => {
    setIsStarting(true);
    const ack = await start();
    if (!ack.ok) {
      setIsStarting(false);
      showError(ack.error);
    }
  };

  const toggleReady = async () => {
    if (!me) return;
    setIsTogglingReady(true);
    const ack = await setReady(!me.ready);
    setIsTogglingReady(false);
    if (!ack.ok) showError(ack.error);
  };

  const difficultyOptions: SegmentedControlOption<DifficultyChoice>[] = [
    { value: "mixed", label: t("mixed") },
    { value: "easy", label: t("quiz:difficulty.easy") },
    { value: "medium", label: t("quiz:difficulty.medium") },
    { value: "hard", label: t("quiz:difficulty.hard") },
  ];

  // La valeur affichée suit le lobby:update : le serveur reste seul juge
  const changeDifficulty = async (choice: DifficultyChoice) => {
    const ack = await setDifficulty(choice === "mixed" ? null : choice);
    if (!ack.ok) showError(ack.error);
  };

  const footerMessage = (() => {
    if (!isConnected) return t("lobby.connecting");
    if (!lobby) return null;
    if (!isHost) {
      return me?.ready
        ? t("lobby.waitingForHost", { username: host?.user.username })
        : null;
    }
    if (!hasEnoughPlayers) return t("lobby.waitingForFriends");
    if (notReady.length > 0) {
      return t("lobby.waitingForReady", {
        names: notReady.map((p) => p.user.username).join(", "),
      });
    }
    return null;
  })();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <LeaveButton onPress={confirmLeave} label={t("lobby.leave")} />
          <Text style={styles.title}>{t("lobby.title")}</Text>
          <View style={styles.spacer} />
        </View>

        {!lobby ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {isHost && (
              <View style={styles.difficulty}>
                <Text style={styles.sectionLabel}>
                  {t("lobby.difficultyLabel")}
                </Text>
                <SegmentedControl
                  options={difficultyOptions}
                  value={lobby.difficulty ?? "mixed"}
                  onChange={changeDifficulty}
                  disabled={!isConnected}
                  accessibilityLabel={t("lobby.difficultyLabel")}
                />
              </View>
            )}
            <View style={[styles.metaRow, isHost && styles.metaRowHost]}>
              {!isHost && <DifficultyChip difficulty={lobby.difficulty} />}
              <Text style={styles.readyCount}>
                {t("lobby.readyCount", {
                  ready: readyCount,
                  total: joined.length,
                })}
              </Text>
            </View>
            <View style={styles.players}>
              {players.map((player) => (
                <LobbyPlayerRow key={player.user.id} player={player} />
              ))}
            </View>
          </ScrollView>
        )}

        <View style={styles.footer}>
          {footerMessage && (
            <Text style={styles.footerText}>{footerMessage}</Text>
          )}
          {lobby && isHost && (
            <Button
              variant="primary"
              title={isStarting ? t("lobby.starting") : t("lobby.start")}
              onPress={handleStart}
              disabled={!canStart || isStarting}
              style={!canStart && styles.buttonDisabled}
            />
          )}
          {lobby && me && !isHost && me.status === "JOINED" && (
            <Button
              variant={me.ready ? "outlined" : "primary"}
              title={me.ready ? t("lobby.unsetReady") : t("lobby.setReady")}
              onPress={toggleReady}
              disabled={isTogglingReady || !isConnected}
            />
          )}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  spacer: {
    width: LEAVE_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    textAlign: "center",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  difficulty: {
    gap: Spacing.md,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  metaRowHost: {
    justifyContent: "flex-end",
  },
  readyCount: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
  },
  players: {
    gap: Spacing.sm,
  },
  footer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  footerText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
});
