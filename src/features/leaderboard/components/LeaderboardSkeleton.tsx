import { Colors, Radius, Shadows, Spacing } from "@/constants/theme";
import { Skeleton } from "@/src/components/Skeleton";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { MEDAL } from "./PodiumColumn";

const PODIUM_ORDER = [1, 0, 2] as const;
const ROW_COUNT = 5;

/** Reprend les dimensions du podium et des lignes pour éviter tout saut. */
export function LeaderboardSkeleton() {
  const { t } = useTranslation("common");

  return (
    <View accessible accessibilityLabel={t("loading")}>
      <View style={styles.podium}>
        {PODIUM_ORDER.map((rank) => (
          <View key={rank} style={styles.column}>
            <Skeleton
              width={MEDAL[rank].size}
              height={MEDAL[rank].size}
              radius={Radius.full}
              style={styles.avatar}
            />
            <View style={[styles.bar, { height: MEDAL[rank].barHeight }]} />
          </View>
        ))}
      </View>

      {Array.from({ length: ROW_COUNT }, (_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={20} height={14} />
          <Skeleton
            width={40}
            height={40}
            radius={Radius.full}
            style={styles.rowAvatar}
          />
          <Skeleton width="45%" height={14} />
          <Skeleton width={40} height={14} style={styles.rowScore} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  podium: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  avatar: {
    marginBottom: Spacing.sm,
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: Radius.md,
    borderTopRightRadius: Radius.md,
    backgroundColor: Colors.surface,
    opacity: 0.6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  rowAvatar: {
    marginHorizontal: Spacing.md,
  },
  rowScore: {
    marginLeft: "auto",
  },
});
