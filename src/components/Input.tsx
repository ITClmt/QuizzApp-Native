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
}

export function Input({ label, style, ...rest }: InputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={Colors.onSurfaceVariant}
        {...rest}
      />
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
  },
});
