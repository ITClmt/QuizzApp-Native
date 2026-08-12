import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAuth } from "@/src/contexts/AuthContext";
import { useProfile } from "@/src/hooks/useProfile";
import { getQuizHistory } from "@/src/services/quiz/quiz.api";
import { getUserScores } from "@/src/services/score/score.api";
import type { HistoryListItem as HistoryListItemType } from "@/src/types";
import { useFocusEffect } from "@react-navigation/native";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryListItem } from "../components/HistoryListItem";
import { ProfileHeader } from "../components/ProfileHeader";
import type { ProfileTab } from "../components/ProfileTabSwitcher";

const HISTORY_PAGE_SIZE = 15;

export default function ProfileScreen() {
  const { user } = useAuth();
  // avatarSlug vient de /users/me et non du JWT : le token garde l'ancienne
  // valeur jusqu'à sa rotation, donc l'avatar changerait avec un temps de retard.
  const profile = useProfile();
  const { t } = useTranslation(["profile", "quiz"]);
  const [activeTab, setActiveTab] = useState<ProfileTab>("scores");
  const [isManualRefresh, setIsManualRefresh] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchScores,
  } = useQuery({
    queryKey: ["user-scores", user?.sub],
    queryFn: () => getUserScores(user?.sub as string),
    enabled: !!user?.sub,
    refetchOnWindowFocus: false,
  });

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    refetch: refetchHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["quiz-history", user?.sub],
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      getQuizHistory({ cursor: pageParam, limit: HISTORY_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!user?.sub && activeTab === "history",
  });

  // React Navigation garde les écrans d'onglets montés : sans ce hook,
  // revenir sur Profile après un quiz réaffiche les scores mis en cache
  // au premier montage (React Query ne rafraîchit pas au changement d'onglet).
  // L'historique souffre du même décalage, mais on l'invalide au lieu de le
  // recharger : si l'onglet est actif React Query relance la requête, sinon
  // (enabled: false) elle est seulement marquée périmée et se rechargera à
  // l'ouverture de l'onglet — plutôt que de rejouer d'un coup toutes les pages
  // déjà chargées à chaque passage sur l'écran.
  useFocusEffect(
    useCallback(() => {
      refetchScores();
      queryClient.invalidateQueries({ queryKey: ["quiz-history", user?.sub] });
    }, [refetchScores, queryClient, user?.sub]),
  );

  const handleRefresh = async () => {
    setIsManualRefresh(true);
    try {
      await Promise.all([
        refetchScores(),
        queryClient.refetchQueries({ queryKey: ["profile"] }),
        activeTab === "history" ? refetchHistory() : Promise.resolve(),
      ]);
    } finally {
      setIsManualRefresh(false);
    }
  };

  const scoreByDifficulty = new Map(
    data?.scores.map((s) => [s.difficulty, s.value]),
  );

  const historyItems: HistoryListItemType[] =
    historyData?.pages.flatMap((page) => page.items) ?? [];
  const listData = activeTab === "history" ? historyItems : [];

  return (
    <GradientBackground>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.safeArea}>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshing={isManualRefresh}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (activeTab === "history" && hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          renderItem={({ item }) => (
            <HistoryListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(app)/history/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          ListHeaderComponent={
            <ProfileHeader
              avatarSlug={profile?.avatarSlug ?? user?.avatarSlug}
              username={user?.username}
              totalScore={data?.totalScore ?? 0}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              scoreByDifficulty={scoreByDifficulty}
              isScoresLoading={isLoading}
              isScoresError={isError}
              onRetryScores={refetchScores}
            />
          }
          ListEmptyComponent={
            activeTab === "history" ? (
              isHistoryLoading ? (
                <View style={styles.centered}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : isHistoryError ? (
                <ErrorNotice
                  message={t("quiz:history.loadError")}
                  onRetry={refetchHistory}
                />
              ) : (
                <View style={styles.centered}>
                  <Text style={styles.emptyText}>{t("quiz:history.empty")}</Text>
                </View>
              )
            ) : null
          }
          ListFooterComponent={
            activeTab === "history" && isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : null
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
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["4xl"] + Spacing.xl,
  },
  centered: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
});
