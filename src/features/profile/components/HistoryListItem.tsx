import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { DIFFICULTY_COLORS } from "@/src/constants/difficulty";
import type { HistoryListItem as HistoryListItemType } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useGameLabels } from "../hooks/useGameLabels";

interface HistoryListItemProps {
  item: HistoryListItemType;
  onPress: () => void;
}

export function HistoryListItem({ item, onPress }: HistoryListItemProps) {
  const { t, i18n } = useTranslation("quiz");
  const { difficultyLabel, categoryLabel } = useGameLabels(
    item.difficulty,
    item.category,
  );

  const color = item.difficulty
    ? DIFFICULTY_COLORS[item.difficulty]
    : Colors.outline;
  const date = new Date(item.createdAt).toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {categoryLabel}
        </Text>
        <Text style={styles.meta}>
          {difficultyLabel} · {date}
          {item.status === "EXPIRED" ? ` · ${t("history.expiredBadge")}` : ""}
        </Text>
      </View>
      <Text style={styles.score}>
        {item.correctCount}/{item.totalQuestions}
      </Text>
      <MaterialIcons
        name="chevron-right"
        size={22}
        color={Colors.onSurfaceVariant}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  info: {
    flex: 1,
    gap: Spacing.xs,
  },
  category: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurface,
  },
  meta: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelSm,
    color: Colors.onSurfaceVariant,
  },
  score: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleSm,
    color: Colors.primary,
  },
});
