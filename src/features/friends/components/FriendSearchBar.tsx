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
import { Pressable, StyleSheet, TextInput, View } from "react-native";

interface FriendSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function FriendSearchBar({ value, onChangeText }: FriendSearchBarProps) {
  const { t } = useTranslation("friends");

  return (
    <View style={styles.container}>
      <MaterialIcons name="search" size={20} color={Colors.outline} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={t("search.placeholder")}
        placeholderTextColor={Colors.onSurfaceVariant}
        accessibilityLabel={t("search.placeholder")}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={20}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel={t("search.clear")}
          hitSlop={8}
        >
          <MaterialIcons name="close" size={18} color={Colors.outline} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    ...Shadows.card,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
  },
});
