import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ResultsActionsProps {
  /** Absent : pas de bouton pour rejouer (ex. plus personne pour une revanche) */
  onReplay?: () => void;
  onHome: () => void;
  /** Par défaut « Rejouer » ; le multijoueur y met « Revanche » */
  replayLabel?: string;
  replayDisabled?: boolean;
}

/** Évite qu'un tap destiné à la dernière question atterrisse sur un bouton de résultats */
const INPUT_LOCK_MS = 1000;

export default function ResultsActions({
  onReplay,
  onHome,
  replayLabel,
  replayDisabled = false,
}: ResultsActionsProps) {
  const { t } = useTranslation("quiz");
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLocked(false), INPUT_LOCK_MS);
    return () => clearTimeout(timer);
  }, []);

  const isReplayDisabled = replayDisabled || locked;

  return (
    <View style={styles.actions}>
      {onReplay && (
        <Pressable
          style={[styles.replayButton, isReplayDisabled && styles.disabled]}
          onPress={onReplay}
          disabled={isReplayDisabled}
          accessibilityRole="button"
          accessibilityState={{ disabled: isReplayDisabled }}
        >
          <Text style={styles.replayButtonText}>
            {replayLabel ?? t("results.playAgain")}
          </Text>
        </Pressable>
      )}
      <Pressable
        style={[styles.homeButton, locked && styles.disabled]}
        onPress={onHome}
        disabled={locked}
        accessibilityRole="button"
        accessibilityState={{ disabled: locked }}
      >
        <Text style={styles.homeButtonText}>{t("results.home")}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingTop: Spacing.md,
  },
  replayButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  replayButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLg,
    color: Colors.primary,
  },
  homeButton: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: "center",
    ...Shadows.card,
  },
  homeButtonText: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyLg,
    color: Colors.onPrimary,
  },
});
