import { MaterialIcons } from "@expo/vector-icons";
import { useState, type Ref } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "../../constants/theme";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  /** Transmis au TextInput : react-hook-form s'en sert pour `setFocus`. */
  ref?: Ref<TextInput>;
}

const TOGGLE_SIZE = 48;

export function Input({
  label,
  style,
  error,
  secureTextEntry,
  ...rest
}: InputProps) {
  const { t } = useTranslation("common");
  // Un champ secret a toujours son bouton œil : rien à penser côté écran.
  const isSecret = !!secureTextEntry;
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[
            styles.input,
            isSecret && styles.inputWithToggle,
            error ? styles.inputError : null,
            style,
          ]}
          placeholderTextColor={Colors.onSurfaceVariant}
          accessibilityLabel={label}
          accessibilityHint={error}
          secureTextEntry={isSecret && !isRevealed}
          {...rest}
        />
        {isSecret && (
          <Pressable
            style={styles.toggle}
            onPress={() => setIsRevealed((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={
              isRevealed ? t("hidePassword") : t("showPassword")
            }
          >
            <MaterialIcons
              name={isRevealed ? "visibility-off" : "visibility"}
              size={20}
              color={Colors.outline}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={styles.errorText} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelMd,
    color: Colors.onSurface,
    marginLeft: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
  },
  // Le texte ne doit pas passer sous le bouton œil.
  inputWithToggle: {
    paddingRight: TOGGLE_SIZE + Spacing.xs,
  },
  inputError: {
    borderColor: Colors.error,
  },
  toggle: {
    position: "absolute",
    right: Spacing.xs,
    top: 0,
    bottom: 0,
    width: TOGGLE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelSm,
    color: Colors.error,
    marginLeft: Spacing.xs,
  },
});
