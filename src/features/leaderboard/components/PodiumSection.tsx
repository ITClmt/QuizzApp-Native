import { Spacing } from "@/constants/theme";
import type { LeaderboardEntry } from "@/src/services/leaderboard/leaderboard.api";
import { StyleSheet, View } from "react-native";
import { PodiumColumn } from "./PodiumColumn";

const PODIUM_ORDER = [1, 0, 2] as const;

interface PodiumSectionProps {
  top3: LeaderboardEntry[];
  currentUserId: string | undefined;
  unit?: string;
}

export function PodiumSection({
  top3,
  currentUserId,
  unit,
}: PodiumSectionProps) {
  return (
    <View style={styles.container}>
      {PODIUM_ORDER.map((rank) => (
        <PodiumColumn
          key={rank}
          rank={rank}
          entry={top3[rank]}
          isSelf={top3[rank]?.userData.id === currentUserId}
          unit={unit}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing["2xl"],
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
});
