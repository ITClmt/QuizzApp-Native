import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import ResultsActions from "@/src/features/quiz/components/ResultsActions";
import UnlockedAvatars from "@/src/features/quiz/components/UnlockedAvatars";
import UnlockedCategories from "@/src/features/quiz/components/UnlockedCategories";
import XpSummary from "@/src/features/quiz/components/XpSummary";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RankingRow } from "../components/RankingRow";
import { useCreateGame } from "../hooks/useCreateGame";
import { useGameResult } from "../hooks/useGameResult";

export default function GameResultsScreen() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation("multiplayer");
  const data = useGameResult(gameId);
  const rematch = useCreateGame();

  if (!data) {
    // Page web rechargée : le cache est vide et la partie ne peut pas encore
    // être relue côté serveur (historique multijoueur à venir).
    return <Redirect href="/(app)" />;
  }

  const { end, difficulty } = data;
  const { ranking, progression } = end;
  const me = ranking.find((p) => p.user.id === user?.sub);
  const winners = ranking.filter((p) => p.isWinner);

  // Revanche : les mêmes, sauf ceux qui ont abandonné ; celui qui clique invite
  const rematchFriendIds = ranking
    .filter((p) => !p.abandoned && p.user.id !== user?.sub)
    .map((p) => p.user.id);

  const title = (() => {
    if (!me?.isWinner) return t("results.gameOver");
    return winners.length > 1 ? t("results.sharedVictory") : t("results.victory");
  })();

  const subtitle = me?.isWinner
    ? null
    : t("results.winners", {
        count: winners.length,
        names: winners.map((w) => w.user.username).join(" & "),
      });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles.ranking}>
            {ranking.map((player) => (
              <RankingRow
                key={player.user.id}
                player={player}
                isMe={player.user.id === user?.sub}
              />
            ))}
          </View>

          <XpSummary
            xpEarned={progression.xpEarned}
            level={progression.level}
            leveledUp={progression.leveledUp}
          />
          <UnlockedCategories categoryIds={progression.unlockedCategoryIds} />
          <UnlockedAvatars slugs={progression.unlockedAvatarSlugs} />
        </ScrollView>

        <ResultsActions
          onReplay={
            rematchFriendIds.length > 0
              ? () => rematch.mutate({ friendIds: rematchFriendIds, difficulty })
              : undefined
          }
          replayLabel={t("results.rematch")}
          replayDisabled={rematch.isPending}
          // dismissTo : l'accueil est déjà sous l'écran, ne pas en empiler un second
          onHome={() => router.dismissTo("/(app)")}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing["2xl"],
    gap: Spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  ranking: {
    gap: Spacing.sm,
  },
});
