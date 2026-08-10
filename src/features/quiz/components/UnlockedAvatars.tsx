import { getAvatarImage } from "@/constants/avatars";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, StyleSheet, Text, View } from "react-native";

interface UnlockedAvatarsProps {
  slugs: string[];
}

export default function UnlockedAvatars({ slugs }: UnlockedAvatarsProps) {
  const { t } = useTranslation("quiz");
  if (slugs.length === 0) return null;

  return (
    <View style={styles.card}>
      <MaterialIcons
        name="lock-open"
        size={22}
        color={Colors.onSuccessContainer}
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>
          {t("results.avatarsUnlocked", { count: slugs.length })}
        </Text>
        <View style={styles.avatarRow}>
          {slugs.map((slug) => (
            <Image
              key={slug}
              source={getAvatarImage(slug)}
              style={styles.avatar}
            />
          ))}
        </View>
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
  avatarRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
});
