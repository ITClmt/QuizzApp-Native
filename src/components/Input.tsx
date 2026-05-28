import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
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
}

export function Input({ label, style, error, ...rest }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={Colors.onSurfaceVariant}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.base,
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.bodyLg,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.labelSm,
    color: Colors.error,
    marginLeft: Spacing.xs,
  },
});
