import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  type Difficulty,
  type LeaderboardEntry,
  getLeaderboard,
  getMyRank,
} from "@/src/services/leaderboard/leaderboard.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DifficultyFilter } from "../components/DifficultyFilter";
import { LeaderboardRow } from "../components/LeaderboardRow";
import { MyRankBanner } from "../components/MyRankBanner";
import { PodiumSection } from "../components/PodiumSection";

export default function LeaderBoardScreen() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchLeaderboard,
    isRefetching: isRefetchingLeaderboard,
  } = useQuery<LeaderboardEntry[]>({
    queryKey: ["leaderboard", difficulty],
    queryFn: () => getLeaderboard(difficulty),
    refetchOnWindowFocus: false,
  });

  const top3 = data?.slice(0, 3) ?? [];
  const rest = data?.slice(3, 10) ?? [];

  const isInTop10 = data?.some((e) => e.userData.id === user?.sub) ?? false;

  const {
    data: myRank,
    refetch: refetchMyRank,
    isRefetching: isRefetchingMyRank,
  } = useQuery({
    queryKey: ["my-rank", difficulty],
    queryFn: () => getMyRank(difficulty),
    refetchOnWindowFocus: false,
  });

  const handleRefresh = () => {
    refetchLeaderboard();
    refetchMyRank();
  };

  const isRefreshing = isRefetchingLeaderboard || isRefetchingMyRank;

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <DifficultyFilter
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load leaderboard.</Text>
        </View>
      ) : data?.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            No scores yet for this difficulty.
          </Text>
        </View>
      ) : (
        <PodiumSection top3={top3} currentUserId={user?.sub} />
      )}
    </>
  );

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={renderHeader}
        renderItem={({ item, index }) => (
          <LeaderboardRow
            entry={item}
            rank={index + 4}
            isSelf={item.userData.id === user?.sub}
          />
        )}
        ListFooterComponent={
          !isInTop10 && myRank && user
            ? () => <MyRankBanner myRank={myRank} user={user} />
            : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: Spacing["4xl"],
  },
  header: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["2xl"],
    paddingBottom: Spacing.base,
    gap: Spacing.base,
  },
  title: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.headlineLg,
    color: Colors.onSurface,
  },
  sectionLabel: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: Spacing["2xl"],
    marginBottom: Spacing.sm,
  },
  centered: {
    paddingVertical: Spacing["5xl"],
    alignItems: "center",
  },
  errorText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.error,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
});
