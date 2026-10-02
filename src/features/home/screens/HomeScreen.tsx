import { GradientBackground } from "@/src/components/GradientBackground";
import { LevelProgressBar } from "@/src/components/LevelProgressBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { ActiveGameCard } from "@/src/features/multiplayer/components/ActiveGameCard";
import { InvitationCard } from "@/src/features/multiplayer/components/InvitationCard";
import { PlayWithFriendsBtn } from "@/src/features/multiplayer/components/PlayWithFriendsBtn";
import { useActiveGame } from "@/src/features/multiplayer/hooks/useActiveGame";
import { useDeclineInvitation } from "@/src/features/multiplayer/hooks/useDeclineInvitation";
import { useGameInvitations } from "@/src/features/multiplayer/hooks/useGameInvitations";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, FontFamily, FontSize, Spacing } from "../../../../constants/theme";
import StartQuizBtn from "../components/StartQuizBtn";

export function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation(["home", "multiplayer"]);
  const invitations = useGameInvitations();
  const activeGame = useActiveGame();
  const decline = useDeclineInvitation();

  // Onglet resté monté : sans ça on garderait l'état du premier affichage. Les
  // invitations arrivent aussi en direct, ce rechargement rattrape le reste.
  const { refetch: refetchInvitations } = invitations;
  const { refetch: refetchActiveGame } = activeGame;
  useFocusEffect(
    useCallback(() => {
      refetchInvitations();
      refetchActiveGame();
    }, [refetchInvitations, refetchActiveGame]),
  );

  const openLobby = (gameId: string) =>
    router.push({ pathname: "/lobby/[gameId]", params: { gameId } });

  const activeGameId = activeGame.data?.game?.id;
  const pendingInvitations = invitations.data ?? [];

  return (
    <GradientBackground>
      <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("welcome", { username: user?.username })}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.bottomContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.levelBarWrapper}>
            <LevelProgressBar />
          </View>

          {activeGameId && (
            <View style={styles.section}>
              <ActiveGameCard onPress={() => openLobby(activeGameId)} />
            </View>
          )}

          {pendingInvitations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>
                {t("multiplayer:home.invitationsTitle")}
              </Text>
              {pendingInvitations.map((invitation) => (
                <InvitationCard
                  key={invitation.gameId}
                  invitation={invitation}
                  onJoin={() => openLobby(invitation.gameId)}
                  onDecline={() => decline.mutate(invitation.gameId)}
                  disabled={decline.isPending}
                />
              ))}
            </View>
          )}

          <StartQuizBtn />
          <PlayWithFriendsBtn />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: Spacing.xl,
    paddingTop: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
  },
  bottomContainer: {
    padding: Spacing.xl,
    paddingTop: 0,
    alignItems: "center",
  },
  levelBarWrapper: {
    width: "100%",
    marginBottom: Spacing.xl,
  },
  section: {
    width: "100%",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
  },
});
