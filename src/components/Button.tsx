import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from "../../constants/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary";
}

export function Button({
  title,
  variant = "primary",
  style,
  ...rest
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primaryBg : styles.secondaryBg,
        style,
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBg: {
    backgroundColor: Colors.primary,
  },
  secondaryBg: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  text: {
    fontFamily: FontFamily.label,
    fontSize: FontSize.titleMd,
  },
  primaryText: {
    color: Colors.onPrimary,
  },
  secondaryText: {
    color: Colors.onSurface,
  },
});
