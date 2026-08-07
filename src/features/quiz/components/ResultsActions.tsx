import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ResultsActionsProps {
  onReplay: () => void;
  onHome: () => void;
}

export default function ResultsActions({
  onReplay,
  onHome,
}: ResultsActionsProps) {
  const { t } = useTranslation("quiz");
  return (
    <View style={styles.actions}>
      <Pressable style={styles.replayButton} onPress={onReplay}>
        <Text style={styles.replayButtonText}>{t("results.playAgain")}</Text>
      </Pressable>
      <Pressable style={styles.homeButton} onPress={onHome}>
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
