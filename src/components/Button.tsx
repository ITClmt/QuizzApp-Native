import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from "../../constants/theme";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "outlined";
}

export function Button({
  title,
  variant = "primary",
  style,
  ...rest
}: ButtonProps) {
  const getBgStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryBg;
      case "outlined":
        return styles.outlinedBg;
      case "secondary":
      default:
        return styles.secondaryBg;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "primary":
        return styles.primaryText;
      case "outlined":
        return styles.outlinedText;
      case "secondary":
      default:
        return styles.secondaryText;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        getBgStyle(),
        pressed && { opacity: 0.8 },
        typeof style === "function"
          ? style({
              pressed,
              hovered: false,
            })
          : style,
      ]}
      {...rest}
    >
      <Text style={[styles.text, getTextStyle()]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  primaryBg: {
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  secondaryBg: {
    backgroundColor: Colors.surface,
    borderColor: Colors.outlineVariant,
    ...Shadows.card,
  },
  outlinedBg: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
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
  outlinedText: {
    color: Colors.primary,
  },
});
