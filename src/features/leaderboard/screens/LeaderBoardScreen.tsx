import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  type LeaderboardEntry,
  type LeaderboardFilter,
  type MyRank,
  getGlobalLeaderboard,
  getLeaderboard,
  getMyGlobalRank,
  getMyRank,
} from "@/src/services/leaderboard/leaderboard.api";
import { useFocusEffect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { LeaderboardRow } from "../components/LeaderboardRow";
import { LeaderboardSkeleton } from "../components/LeaderboardSkeleton";
import { MyRankBanner } from "../components/MyRankBanner";
import { PodiumSection } from "../components/PodiumSection";

export default function LeaderBoardScreen() {
  const [difficulty, setDifficulty] = useState<LeaderboardFilter>("easy");
  const isGlobal = difficulty === "global";
  const { user } = useAuth();
  const { t } = useTranslation("leaderboard");

  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchLeaderboard,
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", difficulty],
    queryFn: async () => {
      if (isGlobal) {
        const entries = await getGlobalLeaderboard();
        return entries.map((e) => ({
          id: e.id,
          value: e.xp,
          difficulty: "easy" as const,
          userData: {
            id: e.id,
            username: e.username,
            avatarSlug: e.avatarSlug,
          },
          createdAt: "",
        }));
      }
      return getLeaderboard(difficulty);
    },
    refetchOnWindowFocus: false,
  });

  const top3 = data?.slice(0, 3) ?? [];
  const rest = data?.slice(3, 10) ?? [];

  const isInTop10 = data?.some((e) => e.userData.id === user?.sub) ?? false;

  const { data: myRank, refetch: refetchMyRank } = useQuery<MyRank | null>({
    queryKey: ["my-rank", difficulty],
    queryFn: async () => {
      if (isGlobal) {
        const rank = await getMyGlobalRank();
        return rank && { rank: rank.rank, value: rank.xp };
      }
      return getMyRank(difficulty);
    },
    refetchOnWindowFocus: false,
  });

  const handleRefresh = async () => {
    setIsManualRefresh(true);
    try {
      await Promise.all([refetchLeaderboard(), refetchMyRank()]);
    } finally {
      setIsManualRefresh(false);
    }
  };

  // Écrans d'onglets restant montés (voir ProfileScreen) : on force le
  // rafraîchissement à chaque retour sur cet onglet plutôt que de servir
  // un classement potentiellement obsolète après une partie.
  useFocusEffect(
    useCallback(() => {
      refetchLeaderboard();
      refetchMyRank();
    }, [refetchLeaderboard, refetchMyRank]),
  );

  const unit = isGlobal ? "xp" : "pts";

  const renderHeader = () => (
    <>
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : isError ? (
        <ErrorNotice message={t("loadError")} onRetry={handleRefresh} />
      ) : data?.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{t("empty")}</Text>
        </View>
      ) : (
        <PodiumSection top3={top3} currentUserId={user?.sub} unit={unit} />
      )}
    </>
  );

  return (
    <GradientBackground>
      <SafeAreaView edges={["left", "right"]} style={styles.safeArea}>
        {/* Hors de la liste : le filtre reste accessible quand on a défilé
            jusqu'au bas du classement. */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("title")}</Text>
          <DifficultyFilter
            difficulty={difficulty}
            setDifficulty={setDifficulty}
          />
        </View>

        <FlatList
          data={rest}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={isManualRefresh}
          onRefresh={handleRefresh}
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => (
            <LeaderboardRow
              entry={item}
              rank={index + 4}
              isSelf={item.userData.id === user?.sub}
              unit={unit}
            />
          )}
          ListFooterComponent={
            !isInTop10 && myRank && user
              ? () => <MyRankBanner myRank={myRank} user={user} unit={unit} />
              : null
          }
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.base,
    gap: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
  },
  centered: {
    paddingVertical: Spacing["5xl"],
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
