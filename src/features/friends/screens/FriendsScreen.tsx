import { Colors, FontFamily, FontSize, Spacing } from "@/constants/theme";
import { BACK_BUTTON_SIZE, BackButton } from "@/src/components/BackButton";
import { ErrorNotice } from "@/src/components/ErrorNotice";
import { GradientBackground } from "@/src/components/GradientBackground";
import { useAlert } from "@/src/contexts/AlertContext";
import type { Friend, FriendRequest, FriendSearchResult } from "@/src/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FriendRow, RowAction } from "../components/FriendRow";
import { FriendSearchBar } from "../components/FriendSearchBar";
import { SearchResultRow } from "../components/SearchResultRow";
import { useFriendMutations } from "../hooks/useFriendMutations";
import { MIN_SEARCH_LENGTH, useFriendSearch } from "../hooks/useFriendSearch";
import { useFriends } from "../hooks/useFriends";

// Une ligne = un type d'item, pour que renderItem sache quelles actions afficher
type Item =
  | { kind: "received"; request: FriendRequest }
  | { kind: "friend"; friend: Friend }
  | { kind: "sent"; request: FriendRequest }
  | { kind: "result"; result: FriendSearchResult };

type Section = { key: string; title?: string; data: Item[] };

function itemKey(item: Item) {
  switch (item.kind) {
    case "friend":
      return `friend-${item.friend.friendshipId}`;
    case "result":
      return `result-${item.result.user.id}`;
    default:
      return `${item.kind}-${item.request.id}`;
  }
}

export default function FriendsScreen() {
  const { t } = useTranslation(["friends", "common"]);
  const { showAlert } = useAlert();
  const [query, setQuery] = useState("");
  const [isManualRefresh, setIsManualRefresh] = useState(false);

  const { friends, requests, refetchAll } = useFriends();
  const search = useFriendSearch(query);
  const { send, accept, deleteRequest, remove, isPending } =
    useFriendMutations();

  const isSearchMode = query.trim().length > 0;

  const confirmRemove = (friend: Friend) => {
    showAlert(
      t("remove.title"),
      t("remove.message", { username: friend.user.username }),
      [
        { text: t("common:cancel"), style: "cancel" },
        {
          text: t("remove.confirm"),
          style: "destructive",
          onPress: () => remove.mutate(friend.user.id),
        },
      ],
    );
  };

  const handleRefresh = async () => {
    setIsManualRefresh(true);
    try {
      await (isSearchMode ? search.refetch() : refetchAll());
    } finally {
      setIsManualRefresh(false);
    }
  };

  const received = requests.data?.received ?? [];
  const sent = requests.data?.sent ?? [];
  const friendList = friends.data ?? [];

  const sections: Section[] = isSearchMode
    ? [
        {
          key: "results",
          data: search.results.map((result) => ({ kind: "result", result })),
        },
      ]
    : [
        {
          key: "received",
          title: t("sections.received", { count: received.length }),
          data: received.map((request) => ({ kind: "received", request })),
        },
        {
          key: "friends",
          title: t("sections.friends", { count: friendList.length }),
          data: friendList.map((friend) => ({ kind: "friend", friend })),
        },
        {
          key: "sent",
          title: t("sections.sent", { count: sent.length }),
          data: sent.map((request) => ({ kind: "sent", request })),
        },
      ].filter((section) => section.data.length > 0) as Section[];

  const renderItem = ({ item }: { item: Item }) => {
    switch (item.kind) {
      case "received":
        return (
          <FriendRow user={item.request.user}>
            <RowAction
              icon="close"
              tone="danger"
              label={t("actions.decline", {
                username: item.request.user.username,
              })}
              onPress={() => deleteRequest.mutate(item.request.id)}
              disabled={isPending}
            />
            <RowAction
              icon="check"
              tone="primary"
              label={t("actions.accept", {
                username: item.request.user.username,
              })}
              onPress={() => accept.mutate(item.request.id)}
              disabled={isPending}
            />
          </FriendRow>
        );
      case "friend":
        return (
          <FriendRow user={item.friend.user}>
            <RowAction
              icon="more-horiz"
              label={t("actions.remove", {
                username: item.friend.user.username,
              })}
              onPress={() => confirmRemove(item.friend)}
              disabled={isPending}
            />
          </FriendRow>
        );
      case "sent":
        return (
          <FriendRow user={item.request.user}>
            <RowAction
              icon="close"
              label={t("actions.cancel", {
                username: item.request.user.username,
              })}
              onPress={() => deleteRequest.mutate(item.request.id)}
              disabled={isPending}
            />
          </FriendRow>
        );
      case "result":
        return (
          <SearchResultRow
            result={item.result}
            disabled={isPending}
            onAdd={(userId) => send.mutate(userId)}
            onAccept={(requestId) => accept.mutate(requestId)}
          />
        );
    }
  };

  const renderEmpty = () => {
    if (isSearchMode) {
      if (query.trim().length < MIN_SEARCH_LENGTH) {
        return <Text style={styles.emptyText}>{t("search.tooShort")}</Text>;
      }
      if (search.isSearching) {
        return <ActivityIndicator size="small" color={Colors.primary} />;
      }
      if (search.isError) {
        return (
          <ErrorNotice message={t("search.error")} onRetry={search.refetch} />
        );
      }
      return <Text style={styles.emptyText}>{t("search.noResults")}</Text>;
    }

    if (friends.isLoading || requests.isLoading) {
      return <ActivityIndicator size="large" color={Colors.primary} />;
    }
    if (friends.isError || requests.isError) {
      return <ErrorNotice message={t("loadError")} onRetry={refetchAll} />;
    }
    return <Text style={styles.emptyText}>{t("empty")}</Text>;
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <BackButton fallbackHref="/(app)/profile" />
          <Text style={styles.title}>{t("title")}</Text>
          {/* Contrepoids du bouton, pour garder le titre centré */}
          <View style={styles.backButtonSpacer} />
        </View>

        <SectionList
          sections={sections}
          keyExtractor={itemKey}
          renderItem={renderItem}
          renderSectionHeader={({ section }) =>
            section.title ? (
              <Text style={styles.sectionLabel}>{section.title}</Text>
            ) : null
          }
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <FriendSearchBar value={query} onChangeText={setQuery} />
            </View>
          }
          ListEmptyComponent={<View style={styles.centered}>{renderEmpty()}</View>}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshing={isManualRefresh}
          onRefresh={handleRefresh}
        />
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
  content: {
    padding: Spacing.xl,
    paddingBottom: Spacing["3xl"],
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.headlineExtrabold,
    fontSize: FontSize.headlineMd,
    color: Colors.onBackground,
    textAlign: "center",
  },
  sectionLabel: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  separator: {
    height: Spacing.sm,
  },
  centered: {
    paddingVertical: Spacing["3xl"],
    alignItems: "center",
  },
  emptyText: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
});
