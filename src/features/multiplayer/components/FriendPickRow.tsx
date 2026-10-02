import { Colors, Radius } from "@/constants/theme";
import { FriendRow } from "@/src/features/friends/components/FriendRow";
import type { FriendUser } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";

interface FriendPickRowProps {
  user: FriendUser;
  selected: boolean;
  onToggle: () => void;
  /** Limite de 3 atteinte : les amis non cochés ne peuvent plus l'être */
  disabled: boolean;
}

/** Ami à cocher pour l'inviter. L'état se lit sur la bordure, pas sur l'ombre. */
export function FriendPickRow({
  user,
  selected,
  onToggle,
  disabled,
}: FriendPickRowProps) {
  const { t } = useTranslation("multiplayer");

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={t("create.invite", { username: user.username })}
      accessibilityState={{ checked: selected, disabled }}
      style={({ pressed }) => [
        styles.frame,
        selected && styles.frameSelected,
        (pressed || disabled) && styles.dimmed,
      ]}
    >
      <FriendRow user={user}>
        <MaterialIcons
          name={selected ? "check-circle" : "radio-button-unchecked"}
          size={26}
          color={selected ? Colors.primary : Colors.outline}
        />
      </FriendRow>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: Radius.lg + 2,
    borderWidth: 2,
    borderColor: "transparent",
  },
  frameSelected: {
    borderColor: Colors.primary,
  },
  dimmed: {
    opacity: 0.5,
  },
});
