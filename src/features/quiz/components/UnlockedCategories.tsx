import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { getCategoryLabelById } from "@/src/constants/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

interface UnlockedCategoriesProps {
  categoryIds: string[];
}

export default function UnlockedCategories({
  categoryIds,
}: UnlockedCategoriesProps) {
  const { t, i18n } = useTranslation("quiz");
  if (categoryIds.length === 0) return null;

  const labels = categoryIds.map((id) =>
    getCategoryLabelById(id, i18n.language),
  );

  return (
    <View style={styles.card}>
      <MaterialIcons
        name="lock-open"
        size={22}
        color={Colors.onSuccessContainer}
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {t("results.categoriesUnlocked", { count: labels.length })}
        </Text>
        <Text style={styles.names}>{labels.join(" · ")}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.successContainer,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing["2xl"],
    ...Shadows.card,
  },
  textBlock: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.bodyMd,
    color: Colors.onSuccessContainer,
  },
  names: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodySm,
    color: Colors.onSurfaceVariant,
  },
});
