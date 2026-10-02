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
import { Pressable, StyleSheet, Text, View } from "react-native";

/** « Partie en cours » : retour au salon après avoir quitté l'écran ou l'app */
export function ActiveGameCard({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation("multiplayer");

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <MaterialIcons name="groups" size={24} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{t("home.activeGame")}</Text>
        <Text style={styles.subtitle}>{t("home.activeGameSubtitle")}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={Colors.primary} />
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
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  pressed: {
    opacity: 0.8,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.bodySemibold,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
  subtitle: {
    marginTop: 2,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.labelLg,
    color: Colors.onSurfaceVariant,
  },
});
