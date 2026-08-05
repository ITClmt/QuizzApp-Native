import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useProfile } from "@/src/hooks/useProfile";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

export function LevelProgressBar() {
  const profile = useProfile();

  if (!profile) return null;

  const xpIntoLevel = profile.xp - profile.xpForCurrentLevel;
  const xpForThisLevel = profile.xpForNextLevel - profile.xpForCurrentLevel;
  const progress = Math.min(1, xpIntoLevel / Math.max(1, xpForThisLevel));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Level {profile.level}</Text>
        <Text style={styles.xpText}>
          {xpForThisLevel > 0
            ? `${xpIntoLevel} / ${xpForThisLevel} XP`
            : "Max level reached"}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <LinearGradient
          colors={[Colors.success, Colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.barFill, { width: `${progress * 100}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontFamily: FontFamily.headlineSemibold,
    fontSize: FontSize.titleMd,
    color: Colors.onSurface,
  },
  xpText: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },
  barTrack: {
    height: 9,
    borderRadius: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
});
