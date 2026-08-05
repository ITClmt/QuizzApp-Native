import { Colors, Radius, Spacing } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface XpSummaryProps {
  xpEarned: number;
  level: number;
  leveledUp: boolean;
}

export default function XpSummary({
  xpEarned,
  level,
  leveledUp,
}: XpSummaryProps) {
  if (xpEarned === 0) return null;

  return (
    <View style={styles.section}>
      {leveledUp && (
        <View style={styles.levelUpBanner}>
          <Text style={styles.levelUpText}>Level up! You reached level {level} 🎉</Text>
        </View>
      )}
      <View style={styles.xpCard}>
        <Text style={styles.xpText}>+{xpEarned} XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing["2xl"],
  },
  levelUpBanner: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.onPrimaryContainer,
    textAlign: "center",
  },
  xpCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  xpText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
});
