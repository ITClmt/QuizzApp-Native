import { Colors, Radius, Shadows } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

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
      style={({ pressed }) => [styles.target, pressed && styles.pressed]}
      disabled={isPending} // Évite un double-tap pendant le call réseau
      accessibilityLabel={t("session.cancelAccessibilityLabel")}
      accessibilityRole="button"
      accessibilityState={{ disabled: isPending }}
    >
      <View style={styles.button}>
        <MaterialIcons
          name="close"
          size={20}
          // Feedback visuel subtil pendant le chargement
          color={isPending ? Colors.onSurfaceVariant : Colors.onSurface}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
  },
  button: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    ...Shadows.card,
  },
});
