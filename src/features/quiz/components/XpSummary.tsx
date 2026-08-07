import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("quiz");
  if (xpEarned === 0) return null;

  return (
    <View style={styles.section}>
      {leveledUp && (
        <View style={styles.levelUpBanner}>
          <Text style={styles.levelUpText}>{t("results.levelUp", { level })}</Text>
        </View>
      )}
      <View style={styles.xpCard}>
        <Text style={styles.xpText}>{t("results.xpEarned", { xp: xpEarned })}</Text>
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
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyMd,
    color: Colors.onPrimaryContainer,
    textAlign: "center",
  },
  xpCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    ...Shadows.card,
  },
  xpText: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleMd,
    color: Colors.primary,
  },
});
