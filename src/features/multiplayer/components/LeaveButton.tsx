import { Colors, Radius, Shadows } from "@/constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";

export const LEAVE_BUTTON_SIZE = 48;

/** Croix ronde de sortie : 36 visuels dans une cible de 48 (plancher tactile) */
export function LeaveButton({
  onPress,
  label,
}: {
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.target, pressed && styles.pressed]}
    >
      <View style={styles.button}>
        <MaterialIcons name="close" size={20} color={Colors.onSurface} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: LEAVE_BUTTON_SIZE,
    height: LEAVE_BUTTON_SIZE,
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
