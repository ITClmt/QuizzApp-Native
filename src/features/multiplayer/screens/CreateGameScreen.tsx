import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { BACK_BUTTON_SIZE, BackButton } from "@/src/components/BackButton";
import { Button } from "@/src/components/Button";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useFriends } from "@/src/features/friends/hooks/useFriends";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FriendPickRow } from "../components/FriendPickRow";
import { useCreateGame } from "../hooks/useCreateGame";

// 2 à 4 joueurs : l'hôte + 1 à 3 amis (mêmes bornes que le back)
const MAX_INVITED_FRIENDS = 3;

export default function CreateGameScreen() {
  const router = useRouter();
  const { t } = useTranslation(["multiplayer", "common"]);
  const { isOnline } = useNetworkStatus();
  const { friends } = useFriends();
  const createGame = useCreateGame();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const isFull = selectedIds.length >= MAX_INVITED_FRIENDS;

  const toggle = (userId: string) => {
    setSelectedIds((ids) =>
      ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId],
    );
  };

  const submit = () => {
    // Mixte au départ : l'hôte règle la difficulté dans le salon
    createGame.mutate({ friendIds: selectedIds, difficulty: null });
  };

  const renderEmpty = () => {
    if (friends.isLoading) {
      return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    if (friends.isError) {
      return (
        <ErrorNotice message={t("create.loadError")} onRetry={friends.refetch} />
      );
    }
    return (
      <View style={styles.noFriends}>
        <Text style={styles.emptyText}>{t("create.noFriends")}</Text>
        <Button
          variant="outlined"
          title={t("create.goToFriends")}
          onPress={() => router.push("/friends")}
        />
      </View>
    );
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <BackButton fallbackHref="/(app)" />
          <Text style={styles.title}>{t("create.title")}</Text>
          <View style={styles.backButtonSpacer} />
        </View>

        <FlatList
          data={friends.data ?? []}
          keyExtractor={(friend) => friend.user.id}
          renderItem={({ item }) => {
            const selected = selectedIds.includes(item.user.id);
            return (
              <FriendPickRow
                user={item.user}
                selected={selected}
                disabled={!selected && isFull}
                onToggle={() => toggle(item.user.id)}
              />
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.sectionLabel}>
                {t("create.friendsLabel")}
              </Text>
              <Text style={styles.count}>
                {t("create.selectedCount", { count: selectedIds.length })}
              </Text>
            </View>
          }
          ListEmptyComponent={<View style={styles.centered}>{renderEmpty()}</View>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        />

        <View style={styles.footer}>
          <Button
            variant="primary"
            title={t("create.submit")}
            onPress={submit}
            disabled={
              selectedIds.length === 0 || createGame.isPending || !isOnline
            }
            style={
              (selectedIds.length === 0 || createGame.isPending || !isOnline) &&
              styles.submitDisabled
            }
          />
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  backButtonSpacer: {
    width: BACK_BUTTON_SIZE,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    textAlign: "center",
  },
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.onSurfaceVariant,
  },
  count: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.titleSm,
    color: Colors.primary,
  },
  separator: {
    height: Spacing.sm,
  },
  centered: {
    paddingTop: Spacing.xl,
    alignItems: "center",
  },
  noFriends: {
    alignItems: "center",
    gap: Spacing.base,
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  submitDisabled: {
    opacity: 0.5,
  },
});
