import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { Skeleton } from "@/src/components/Skeleton";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

/** Calque des 3 cartes DifficultyScoreCard. */
export function ScoresSkeleton() {
  const { t } = useTranslation("common");

  return (
    <View style={styles.list} accessible accessibilityLabel={t("loading")}>
      {Array.from({ length: 3 }, (_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.scoreInfo}>
            <Skeleton width="30%" height={14} />
            <Skeleton height={6} radius={Radius.full} />
          </View>
          <Skeleton width={28} height={20} />
        </View>
      ))}
    </View>
  );
}

/** Calque des lignes HistoryListItem. */
export function HistorySkeleton() {
  const { t } = useTranslation("common");

  return (
    <View accessible accessibilityLabel={t("loading")}>
      {Array.from({ length: 4 }, (_, i) => (
        <View key={i} style={[styles.card, styles.historyCard]}>
          <Skeleton width={10} height={10} radius={Radius.full} />
          <View style={styles.historyInfo}>
            <Skeleton width="55%" height={14} />
            <Skeleton width="35%" height={11} />
          </View>
          <Skeleton width={44} height={24} radius={Radius.full} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.card,
  },
  scoreInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  historyInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
});
