import { Colors, Radius, Shadows } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

export const BACK_BUTTON_SIZE = 40;

interface BackButtonProps {
  /**
   * Destination quand il n'y a rien à dépiler : écran ouvert directement par
   * son URL (web, rechargement de page).
   */
  fallbackHref: Href;
}

/** Bouton rond « < » qui revient à l'écran précédent */
export function BackButton({ fallbackHref }: BackButtonProps) {
  const { t } = useTranslation("common");

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.navigate(fallbackHref);
  };

  return (
    <Pressable
      onPress={goBack}
      style={styles.button}
      hitSlop={8} // 40 visuels + 8 de marge : plancher tactile atteint
      accessibilityRole="button"
      accessibilityLabel={t("back")}
    >
      <MaterialIcons name="chevron-left" size={26} color={Colors.onSurface} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: BACK_BUTTON_SIZE,
    height: BACK_BUTTON_SIZE,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
});
