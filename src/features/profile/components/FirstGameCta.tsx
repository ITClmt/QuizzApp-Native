import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "@/constants/theme";
import { Button } from "@/src/components/Button";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

/**
 * État vide d'un profil sans aucun point : plutôt qu'une rangée de zéros,
 * on l'envoie directement vers sa première partie.
 */
export function FirstGameCta() {
  const { t } = useTranslation("profile");
  const { isOnline } = useNetworkStatus();

  return (
    <View style={styles.card}>
      <View style={styles.iconWrapper}>
        <MaterialIcons name="sports-esports" size={28} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{t("firstGame.title")}</Text>
      <Text style={styles.subtitle}>
        {isOnline ? t("firstGame.subtitle") : t("common:offline")}
      </Text>
      <Button
        variant="primary"
        title={t("firstGame.cta")}
        onPress={() => router.push("/(quiz)/preQuiz")}
        disabled={!isOnline}
        style={[styles.button, !isOnline && styles.disabled]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryContainer,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: FontFamily.headline,
    fontSize: FontSize.titleLg,
    color: Colors.onSurface,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.bodyMd,
    color: Colors.onSurfaceVariant,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.md,
    alignSelf: "stretch",
  },
  disabled: {
    opacity: 0.5,
  },
});
