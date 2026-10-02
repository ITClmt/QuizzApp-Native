import { Colors, FontFamily, FontSize, Radius, Spacing } from "@/constants/theme";
import { DIFFICULTY_COLORS } from "@/src/constants/difficulty";
import type { GameDifficulty } from "@/src/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";

/** Difficulté d'une partie ; « Mixte » en neutre, faute de couleur de légende */
export function DifficultyChip({
  difficulty,
}: {
  difficulty: GameDifficulty | null;
}) {
  const { t } = useTranslation(["quiz", "multiplayer"]);
  const color = difficulty ? DIFFICULTY_COLORS[difficulty] : Colors.outline;

  return (
    <Text style={[styles.chip, { color, borderColor: color }]}>
      {difficulty ? t(`quiz:difficulty.${difficulty}`) : t("multiplayer:mixed")}
    </Text>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    borderRadius: Radius.full,
    overflow: "hidden",
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.labelMd,
  },
});
