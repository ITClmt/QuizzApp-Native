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
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

/** Sans fond ni ombre, pour s'intégrer dans une carte existante. */
interface LevelProgressBarProps {
  embedded?: boolean;
}

export function LevelProgressBar({ embedded = false }: LevelProgressBarProps) {
  const profile = useProfile();
  const { t } = useTranslation("common");

  if (!profile) return null;

  const xpIntoLevel = profile.xp - profile.xpForCurrentLevel;
  const xpForThisLevel = profile.xpForNextLevel - profile.xpForCurrentLevel;
  const progress = Math.min(1, xpIntoLevel / Math.max(1, xpForThisLevel));

  return (
    <View style={[styles.container, !embedded && styles.card]}>
      <View style={styles.header}>
        <Text style={styles.label}>{t("level", { level: profile.level })}</Text>
        <Text style={styles.xpText}>
          {xpForThisLevel > 0
            ? t("xpProgress", { current: xpIntoLevel, total: xpForThisLevel })
            : t("maxLevelReached")}
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
  container: {
    width: "100%",
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
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
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: Radius.full,
  },
});
