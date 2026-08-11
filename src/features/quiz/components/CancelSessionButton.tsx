import { Colors, Shadows } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

interface CancelSessionButtonProps {
  /** Confirmation + annulation : voir useCancelQuizSession, porté par l'écran. */
  onPress: () => void;
  isPending?: boolean;
}

export default function CancelSessionButton({
  onPress,
  isPending = false,
}: CancelSessionButtonProps) {
  const { t } = useTranslation("quiz");

  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      hitSlop={8} // Agrandit la zone de clic sans changer l'apparence visuelle
      disabled={isPending} // Évite un double-tap pendant le call réseau
      accessibilityLabel={t("session.cancelAccessibilityLabel")}
      accessibilityRole="button"
      accessibilityState={{ disabled: isPending }}
    >
      <MaterialIcons
        name="close"
        size={20}
        // Feedback visuel subtil pendant le chargement
        color={isPending ? Colors.onSurfaceVariant : Colors.onSurface}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
});
